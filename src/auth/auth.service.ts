import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { TokensService } from 'src/tokens/tokens.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';

export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private tokensService: TokensService,
  ) {}

  async register(userDto: RegisterUserDto) {
    const { password, email, name } = userDto;

    let user = await this.userModel.findOne({ email: email });
    if (user) throw new HttpException('User already exists', 400);

    const passwordHash = await bcrypt.hash(password, 10);

    user = new this.userModel({
      email: email,
      password: passwordHash,
      name: name,
    });

    const tokens = this.tokensService.generateTokenPair({
      _id: user._id,
      email: user.email,
    });

    user.refreshToken = tokens.refresh_token;
    await user.save();

    return {
      email: user.email,
      name: user.name,
      _id: user._id,
      refreshToken: user.refreshToken,
      accessToken: tokens.access_token,
    };
  }

  async login(userDto: LoginUserDto) {
    const { password, email } = userDto;

    const user = await this.userModel.findOne({ email: email });
    if (!user) throw new HttpException('Cant find a user', 400);

    const isLogin = bcrypt.compareSync(password, user.password);

    if (!isLogin) throw new HttpException('Incorrect email or password', 400);

    const tokens = this.tokensService.generateTokenPair({
      _id: user._id,
      email: user.email,
    });

    user.refreshToken = tokens.refresh_token;
    await user.save();

    return {
      email: user.email,
      name: user.name,
      _id: user._id,
      refreshToken: user.refreshToken,
      accessToken: tokens.access_token,
    };
  }

  async refreshToken(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new HttpException('Cant find a user', 400);

    const tokens = this.tokensService.generateTokenPair({
      _id: user._id,
      email: user.email,
    });

    user.refreshToken = tokens.refresh_token;
    await user.save();

    return {
      email: user.email,
      name: user.name,
      _id: user._id,
      refreshToken: user.refreshToken,
      accessToken: tokens.access_token,
    };
  }

  async logout(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new HttpException('Cant find a user', 400);

    user.refreshToken = '';
    await user.save();
  }
}
