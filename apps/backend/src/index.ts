import express, { Request, Response, Router } from 'express';
import 'dotenv/config';
import cors from 'cors';
import authRoutes from './routes/auth';
import './models/db';
import { User } from './models/user';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cors({}));
app.use(cookieParser());

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

const PORT = process.env.PORT || 8080;

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  throw new Error(
    'JWT_SECRET or JWT_REFRESH_SECRET not set in environment variables.'
  );
}

export const jwt_secret = process.env.JWT_SECRET;
export const jwt_refresh_secret = process.env.JWT_REFRESH_SECRET;

app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
