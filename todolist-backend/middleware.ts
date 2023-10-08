import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './auth';

interface RequestWithUser extends Request {
  user?: {
    userId: number;
  };
}

// Auth middleware
export const authMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const user = verifyToken(token);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(403).end();
    }
  } else {
    res.status(401).end();
  }
};

