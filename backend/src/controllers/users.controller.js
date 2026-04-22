import path from 'node:path';
import { z } from 'zod';
import { prisma } from '../prisma/client.js';

const updateSchema = z.object({
  name: z.string().min(2).optional(),
});

export const me = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, avatar: true, createdAt: true },
  });
  return res.json(user);
};

export const updateMe = async (req, res) => {
  const data = updateSchema.parse(req.body);
  const avatar = req.file ? `/uploads/avatars/${path.basename(req.file.filename)}` : undefined;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { ...data, ...(avatar ? { avatar } : {}) },
    select: { id: true, name: true, email: true, avatar: true },
  });

  return res.json(user);
};

export const getUserModels = async (req, res) => {
  const models = await prisma.model.findMany({
    where: { userId: req.params.userId },
    include: { files: true },
    orderBy: { createdAt: 'desc' },
  });

  return res.json(models);
};
