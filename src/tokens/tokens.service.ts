import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserForToken } from './interfaces/UserForToken';
@Injectable()
export class TokensService {
  constructor(private jwtService: JwtService) {}

  generateTokenPair(user: UserForToken) {
    const access_token = this.jwtService.sign(
      { ...user },
      {
        secret: process.env.ACCESS_TOKEN_PRIVATE_KEY,
        expiresIn: '1h',
      },
    );

    const refresh_token = this.jwtService.sign(
      { ...user },
      {
        secret: process.env.REFRESH_TOKEN_PRIVATE_KEY,
        expiresIn: '10d',
      },
    );

    return { access_token, refresh_token };
  }

  parseAccessToken(access_token: string) {
    this.jwtService.verify(access_token, {
      secret: process.env.ACCESS_TOKEN_PRIVATE_KEY,
    });
  }

  parseRefreshToken(refresh_token: string) {
    this.jwtService.verify(refresh_token, {
      secret: process.env.REFRESH_TOKEN_PRIVATE_KEY,
    });
  }
}
