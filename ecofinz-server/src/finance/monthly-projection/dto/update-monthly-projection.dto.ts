import { PartialType } from '@nestjs/swagger';
import { CreateMonthlyProjectionDto } from './create-monthly-projection.dto';

export class UpdateMonthlyProjectionDto extends PartialType(CreateMonthlyProjectionDto) {}
