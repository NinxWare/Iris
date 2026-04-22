import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

const ACCESS_EXPIRY = '15m';
const REFRESH_DAYS = 7;

export const signAccessToken = (user) =>
  jwt.sign({ sub: user.id, email: user.email, name: user.name }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRY,
  });

export const signRefreshToken = () => crypto.randomBytes(48).toString('hex');

export const refreshTokenExpirationDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + REFRESH_DAYS);
  return date;
};
