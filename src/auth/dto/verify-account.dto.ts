
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyAccountDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  verifyPin: string;
}
