import { Module } from '@nestjs/common';
import { MonthlyProjectionService } from './monthly-projection.service';
import { MonthlyProjectionController } from './monthly-projection.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MonthlyProjectionController],
  providers: [MonthlyProjectionService],
  exports: [MonthlyProjectionService],
})
export class MonthlyProjectionModule {}
