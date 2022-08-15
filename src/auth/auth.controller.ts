import { Body, Controller, Post, Res, ValidationPipe } from '@nestjs/common';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
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
    delete user['refreshToken'];

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
    delete user['refreshToken'];

    response
      .cookie('refreshToken', user.refreshToken, {
        maxAge: 10 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .send(user);
  }

  @Post('refresh')
  async refresh(@Headers('authorization') bearer) {
    await this.authService.refreshToken(bearer);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    await this.authService.logout();
    response.clearCookie('refreshToken');
  }
}
