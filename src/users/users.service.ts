import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class UsersService {
  constructor() {}
}
