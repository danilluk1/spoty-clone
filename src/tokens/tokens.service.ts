import { Injectable } from '@nestjs/common';
import { UserForToken } from './interfaces/UserForToken';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class TokensService {
  constructor() {}

  generateTokenPair(user: UserForToken) {
    const access_token = jwt.sign(
      { ...user },
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      { expiresIn: '1h' },
    );

    const refresh_token = jwt.sign(
      { ...user },
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      { expiresIn: '10d' },
    );

    return { access_token, refresh_token };
  }

  parseAccessToken(access_token: string) {
    try {
      return jwt.verify(
        access_token,
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
      ) as UserForToken;
    } catch (e) {
      return null;
    }
  }

  parseRefreshToken(refresh_token: string): UserForToken {
    try {
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_PRIVATE_KEY,
      ) as UserForToken;
      return decoded;
    } catch (e) {
      return null;
    }
  }
}
