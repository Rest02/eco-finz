import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateFixedExpenseDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  isActive?: boolean;
}
