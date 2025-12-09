import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordAuthDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
