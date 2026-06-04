import { IsOptional, IsString, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectionStatus } from 'src/generated/prisma/enums';

export class QueryMonthlyProjectionDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  month?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  year?: number;

  @IsOptional()
  @IsEnum(ProjectionStatus)
  status?: ProjectionStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
