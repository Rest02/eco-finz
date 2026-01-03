import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum TransactionType {
  INGRESO = 'INGRESO',
  EGRESO = 'EGRESO',
  AHORRO = 'AHORRO',
}

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;
}
