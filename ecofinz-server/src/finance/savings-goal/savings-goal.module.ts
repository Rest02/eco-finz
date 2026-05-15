import { Module } from '@nestjs/common';
import { SavingsGoalService } from './savings-goal.service';
import { SavingsGoalController } from './savings-goal.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SavingsGoalController],
  providers: [SavingsGoalService],
  exports: [SavingsGoalService],
})
export class SavingsGoalModule {}
