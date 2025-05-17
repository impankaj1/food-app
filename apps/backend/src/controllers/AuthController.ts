import { Request, Response } from 'express';
import {
  LoginDTO,
  LoginSchema,
  RefreshTokenSchema,
  SignUpDTO,
  SignUpSchema,
} from '../validators/AuthValidator';
import { ZodError } from 'zod';
import { userService } from '../services/UserService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import UserTransformer from '../helpers/UserTransformer';
import { jwt_refresh_secret, jwt_secret } from '..';
import tokenGenerator from '../helpers/TokenGenerator';
import { tokenService } from '../services/TokenService';

export default class AuthController {
  public static async signup(req: Request, res: Response): Promise<any> {
    let data: SignUpDTO = req.body;

    try {
      data = SignUpSchema.parse(data);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(403).json({ message: error.errors[0]?.message });
      } else {
        return res
          .status(403)
          .json({ message: `Unexpected error occurred : ${error.message}` });
      }
    }

    const existingUser = await userService.getUserByEmail(data.email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const { password, ...userData } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userService.createUser({
      ...userData,
      password: hashedPassword,
    });

    const { authToken, refreshToken } = tokenGenerator(user);
    const hashedToken = await bcrypt.hash(refreshToken, 10);

    await tokenService.createRefreshToken(hashedToken, user);

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/auth/refresh',
        maxAge: 1000 * 60 * 60 * 24 * 90,
      })
      .json({ user: UserTransformer(user), token: authToken });
  }

  public static async login(req: Request, res: Response): Promise<any> {
    let data: LoginDTO = req.body;

    try {
      data = LoginSchema.parse(data);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(403).json({ message: error.errors[0]?.message });
      } else {
        return res
          .status(403)
          .json({ message: `Unexpected error occurred : ${error.message}` });
      }
    }

    const user = await userService.getUserByEmail(data.email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(403).json({ message: 'Incorrect Password' });
    }

    const { authToken, refreshToken } = tokenGenerator(user);

    const dbRefreshToken = await tokenService.getRefreshToken(user.email);

    const hashedToken = await bcrypt.hash(refreshToken, 10);

    if (dbRefreshToken) {
      await tokenService.deleteRefreshToken(user.email);
      await tokenService.createRefreshToken(hashedToken, user);
    } else {
      await tokenService.createRefreshToken(hashedToken, user);
    }
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/auth/refresh',
        maxAge: 1000 * 60 * 60 * 24 * 90,
      })
      .json({ user: UserTransformer(user), token: authToken });
  }

  public static async refreshToken(req: Request, res: Response): Promise<any> {
    let data = req.cookies;
    try {
      data = RefreshTokenSchema.parse(data);
    } catch (e: any) {
      if (e instanceof ZodError) {
        return res.status(403).json({ message: e.errors[0]?.message });
      } else {
        return res
          .status(403)
          .json({ message: `Unexpected error occurred : ${e.message}` });
      }
    }

    jwt.verify(
      data.refreshToken,
      jwt_refresh_secret,
      async (err: any, decoded: any) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Refresh token expired' });
          }
          return res
            .status(403)
            .json({ message: 'Error while verifying token' });
        }

        const { email } = decoded as Partial<User>;
        const user = await userService.getUserByEmail(email!);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        const dbRefreshToken = await tokenService.getRefreshToken(user.email);

        if (!dbRefreshToken) {
          return res.status(404).json({ message: 'Refresh token not found' });
        }

        const isValid = await bcrypt.compare(
          data.refreshToken,
          dbRefreshToken.refreshTokenHash
        );

        if (!isValid) {
          return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const { authToken, refreshToken } = tokenGenerator(user);

        const hashedToken = await bcrypt.hash(refreshToken, 10);

        if (dbRefreshToken) {
          await tokenService.deleteRefreshToken(user.email);
          await tokenService.createRefreshToken(hashedToken, user);
        } else {
          await tokenService.createRefreshToken(hashedToken, user);
        }

        res
          .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/auth/refresh',
            maxAge: 1000 * 60 * 60 * 24 * 90,
          })
          .json({ token: authToken });
      }
    );
  }
}
