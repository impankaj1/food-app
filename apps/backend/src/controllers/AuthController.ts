import { Request, Response } from 'express';
import {
  LoginDTO,
  LoginSchema,
  SignUpDTO,
  SignUpSchema,
} from '../validators/AuthValidator';
import { ZodError } from 'zod';
import { userService } from '../services/UserService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwt_refresh_secret, jwt_secret } from '..';
import { RefreshTokenModel } from '../models/refreshToken';
import tokenGenerator from '../helpers/TokenGenerator';
import { tokenService } from '../services/TokenService';
import UserTransformer from '../helpers/UserTransformer';

class authController {
  public static _instance: authController;
  public static getInstance(): authController {
    if (!this._instance) {
      this._instance = new authController();
    }
    return this._instance;
  }

  public async signup(req: Request, res: Response): Promise<any> {
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

  public async login(req: Request, res: Response): Promise<any> {
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
      return res.status(404).json({ message: 'User Not found' });
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
      await RefreshTokenModel.findByIdAndDelete(dbRefreshToken._id);
    }

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

  public async refreshToken(req: Request, res: Response) {
    try {
      const data = req.cookies;

      const decodedData = jwt.verify(data.refreshToken, jwt_refresh_secret) as {
        email: string;
        first_name: string;
      };

      const user = await userService.getUserByEmail(decodedData.email);

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

      await tokenService.deleteRefreshToken(user.email);

      await tokenService.createRefreshToken(hashedToken, user);

      res
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/auth/refresh',
          maxAge: 1000 * 60 * 60 * 24 * 90,
        })
        .json({ token: authToken });
    } catch (e) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
}

const AuthController = authController.getInstance();

export default AuthController;
