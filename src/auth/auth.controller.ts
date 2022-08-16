import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { Headers } from '@nestjs/common';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new ValidationPipe()) registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.register(registerUserDto);

    response
      .cookie('refreshToken', user.refreshToken, {
        maxAge: 10 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .send(user);
  }

  @Post('login')
  async login(
    @Body(new ValidationPipe()) loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.login(loginUserDto);

    response
      .cookie('refreshToken', user.refreshToken, {
        maxAge: 10 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .send(user);
  }

  @Post('refresh')
  async refresh(@Req() request: Request) {
    const { refreshToken } = request.cookies;
    const res = await this.authService.refreshToken(refreshToken);

    return res;
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken } = request.cookies;
    await this.authService.logout(refreshToken);
    response.clearCookie('refreshToken').status(200);
  }
}
