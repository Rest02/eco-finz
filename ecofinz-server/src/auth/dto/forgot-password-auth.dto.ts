import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
