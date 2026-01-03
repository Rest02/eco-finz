import { Module } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';

@Module({
  imports: [PrismaModule],
  controllers: [FinanceController, CategoryController],
  providers: [FinanceService, CategoryService]
})
export class FinanceModule {}
