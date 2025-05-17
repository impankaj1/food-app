import { RefreshToken, RefreshTokenModel } from '../models/refreshToken';
import { User } from '../models/user';

class TokenService {
  public static _instance: TokenService | null;
  public static getInstance(): TokenService {
    if (!this._instance) {
      this._instance = new TokenService();
    }
    return this._instance;
  }

  public async getRefreshToken(email: string): Promise<RefreshToken | null> {
    const refreshToken = await RefreshTokenModel.findOne({
      email: email,
    });
    return refreshToken ? refreshToken.toObject() : null;
  }

  public async createRefreshToken(
    hashToken: string,
    user: User
  ): Promise<RefreshToken> {
    const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    const refreshToken = await RefreshTokenModel.create({
      email: user.email,
      refreshTokenHash: hashToken,
      expiresAt,
      first_name: user.first_name,
    });
    return refreshToken.toObject();
  }

  public async deleteRefreshToken(
    email: string
  ): Promise<Record<string, boolean>> {
    await RefreshTokenModel.deleteOne({ email: email });
    return { deleted: true };
  }
}

export const tokenService = TokenService.getInstance();
