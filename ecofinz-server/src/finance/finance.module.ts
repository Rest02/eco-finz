import { Module } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [PrismaModule, AccountModule, TransactionModule],
  controllers: [FinanceController, CategoryController],
  providers: [FinanceService, CategoryService]
})
export class FinanceModule {}
