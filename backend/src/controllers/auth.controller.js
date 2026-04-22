import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../prisma/client.js';
import { refreshTokenExpirationDate, signAccessToken, signRefreshToken } from '../utils/tokens.js';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const register = async (req, res) => {
  const data = registerSchema.parse(req.body);
  const exists = await prisma.user.findUnique({ where: { email: data.email } });
  if (exists) return res.status(409).json({ message: 'E-mail já cadastrado' });

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, passwordHash },
  });

  return res.status(201).json({ id: user.id, name: user.name, email: user.email });
};

export const login = async (req, res) => {
  const data = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });

  const ok = await bcrypt.compare(data.password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Credenciais inválidas' });

  const refreshToken = signRefreshToken();
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt: refreshTokenExpirationDate() },
  });

  return res.json({
    accessToken: signAccessToken(user),
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
  });
};

export const refresh = async (req, res) => {
  const token = z.string().min(8).parse(req.body.refreshToken);
  const saved = await prisma.refreshToken.findUnique({ where: { token }, include: { user: true } });
  if (!saved || saved.expiresAt < new Date()) return res.status(401).json({ message: 'Refresh token inválido' });

  return res.json({
    accessToken: signAccessToken(saved.user),
  });
};
