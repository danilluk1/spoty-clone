import { Body, Controller, Get, Post, Res, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {

  }

}
