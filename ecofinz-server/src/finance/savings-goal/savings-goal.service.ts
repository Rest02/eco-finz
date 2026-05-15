import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSavingsGoalDto } from './dto/create-savings-goal.dto';
import { UpdateSavingsGoalDto } from './dto/update-savings-goal.dto';
import { TransactionType } from '../../generated/prisma/client';

@Injectable()
export class SavingsGoalService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateSavingsGoalDto) {
    const totalAllocated = await this.getTotalAllocatedPercentage(userId);
    const newTotal = totalAllocated + dto.allocatedPercentage;
    if (newTotal > 100) {
      throw new BadRequestException(
        `No puedes asignar más del 100% del ahorro total. Ya tienes ${totalAllocated}% asignado y estás intentando agregar ${dto.allocatedPercentage}%.`,
      );
    }

    return this.prisma.savingsGoal.create({
      data: {
        name: dto.name,
        description: dto.description,
        targetAmount: dto.targetAmount,
        allocatedPercentage: dto.allocatedPercentage,
        deadline: dto.deadline ? new Date(dto.deadline) : undefined,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    const goals = await this.prisma.savingsGoal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const totalSaved = await this.computeTotalSavings(userId);

    return {
      totalSaved,
      goals: goals.map((goal) => ({
        ...goal,
        targetAmount: Number(goal.targetAmount),
        allocatedPercentage: Number(goal.allocatedPercentage),
        currentAmount: Math.min(
          (totalSaved * Number(goal.allocatedPercentage)) / 100,
          Number(goal.targetAmount),
        ),
        progress:
          Number(goal.targetAmount) > 0
            ? Math.min(
                100,
                Math.round(
                  ((totalSaved * Number(goal.allocatedPercentage)) / 100 /
                    Number(goal.targetAmount)) *
                    100,
                ),
              )
            : 0,
      })),
    };
  }

  async findOne(userId: string, id: string) {
    const goal = await this.prisma.savingsGoal.findUnique({ where: { id } });
    if (!goal || goal.userId !== userId) {
      throw new NotFoundException('Savings goal not found');
    }

    const totalSaved = await this.computeTotalSavings(userId);

    return {
      ...goal,
      targetAmount: Number(goal.targetAmount),
      allocatedPercentage: Number(goal.allocatedPercentage),
      currentAmount: (totalSaved * Number(goal.allocatedPercentage)) / 100,
      progress:
        Number(goal.targetAmount) > 0
          ? Math.min(
              100,
              Math.round(
                ((totalSaved * Number(goal.allocatedPercentage)) / 100 /
                  Number(goal.targetAmount)) *
                  100,
              ),
            )
          : 0,
    };
  }

  async update(userId: string, id: string, dto: UpdateSavingsGoalDto) {
    const existing = await this.prisma.savingsGoal.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      throw new NotFoundException('Savings goal not found');
    }

    if (dto.allocatedPercentage !== undefined) {
      const otherGoalsTotal = await this.getTotalAllocatedPercentage(userId, id);
      const newTotal = otherGoalsTotal + dto.allocatedPercentage;
      if (newTotal > 100) {
        throw new BadRequestException(
          `No puedes asignar más del 100% del ahorro total. Otras metas ya ocupan ${otherGoalsTotal}%.`,
        );
      }
    }

    const updateData: any = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.targetAmount !== undefined) updateData.targetAmount = dto.targetAmount;
    if (dto.allocatedPercentage !== undefined) updateData.allocatedPercentage = dto.allocatedPercentage;
    if (dto.deadline !== undefined) updateData.deadline = dto.deadline ? new Date(dto.deadline) : null;

    return this.prisma.savingsGoal.update({ where: { id }, data: updateData });
  }

  async remove(userId: string, id: string) {
    const existing = await this.prisma.savingsGoal.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      throw new NotFoundException('Savings goal not found');
    }
    return this.prisma.savingsGoal.delete({ where: { id } });
  }

  async getSummary(userId: string) {
    const totalSaved = await this.computeTotalSavings(userId);
    const goals = await this.prisma.savingsGoal.findMany({
      where: { userId, status: 'ACTIVE' },
    });

    const totalAllocated = goals.reduce(
      (sum, g) => sum + Number(g.allocatedPercentage),
      0,
    );

    return {
      totalSaved,
      totalAllocatedPercentage: totalAllocated,
      availablePercentage: Math.max(0, 100 - totalAllocated),
      goalCount: goals.length,
    };
  }

  private async getTotalAllocatedPercentage(
    userId: string,
    excludeGoalId?: string,
  ) {
    const goals = await this.prisma.savingsGoal.findMany({
      where: {
        userId,
        status: 'ACTIVE',
        ...(excludeGoalId ? { id: { not: excludeGoalId } } : {}),
      },
    });

    return goals.reduce((sum, g) => sum + Number(g.allocatedPercentage), 0);
  }

  private async computeTotalSavings(userId: string): Promise<number> {
    const accounts = await this.prisma.account.findMany({ where: { userId } });

    const savingsAccountsBalance = accounts
      .filter((a) => a.isSavingsAccount)
      .reduce((sum, acc) => sum + Number(acc.balance), 0);

    const savingsTxns = await this.prisma.transaction.findMany({
      where: { userId, type: TransactionType.AHORRO },
    });

    const otherSavingsTotal = savingsTxns.reduce((sum, tx) => {
      if (tx.isInflow) return sum;
      const amount = Number(tx.amount);
      const originAccount = accounts.find((a) => a.id === tx.accountId);
      if (originAccount?.isSavingsAccount) return sum;
      return sum + amount;
    }, 0);

    return savingsAccountsBalance + otherSavingsTotal;
  }
}
