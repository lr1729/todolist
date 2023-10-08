import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, 'your-secret-key', { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, 'your-secret-key');
  } catch {
    return null;
  }
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

