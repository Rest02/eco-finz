import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateSavingsGoalDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1)
  targetAmount: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  allocatedPercentage: number;

  @IsString()
  @IsOptional()
  deadline?: string;
}
