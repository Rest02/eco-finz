import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';

export class CreateProjectionDto {
  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsNumber()
  @Min(1)
  installments: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  startMonth: number;

  @IsNumber()
  @Min(2020)
  startYear: number;

  @IsString()
  accountId: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsBoolean()
  @IsOptional()
  isSimulation?: boolean;
}
