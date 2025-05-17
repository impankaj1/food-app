import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { jwt_secret } from '..';
import { userService } from '../services/UserService';
import { User } from '../models/user';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Token not found in middleware' });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwt_secret) as Partial<User>;

    const user = await userService.getUserByEmail(decoded.email!);
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    req.user = user;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Token expired' });
    } else {
      res.status(403).json({ message: 'Invalid token' });
    }
  }
};
