import { IsEmail, Length } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @Length(5, 20)
  password: string;

  @Length(5, 30)
  name: string;
}
