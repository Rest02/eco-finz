import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFixedExpenseDto } from './dto/create-fixed-expense.dto';
import { UpdateFixedExpenseDto } from './dto/update-fixed-expense.dto';

@Injectable()
export class FixedExpenseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateFixedExpenseDto) {
    return this.prisma.fixedExpense.create({
      data: {
        name: dto.name,
        amount: dto.amount,
        isActive: dto.isActive ?? true,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    const expenses = await this.prisma.fixedExpense.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return expenses.map((e) => ({
      ...e,
      amount: Number(e.amount),
    }));
  }

  async findOne(userId: string, id: string) {
    const expense = await this.prisma.fixedExpense.findUnique({ where: { id } });
    if (!expense || expense.userId !== userId) {
      throw new NotFoundException('Fixed expense not found');
    }
    return { ...expense, amount: Number(expense.amount) };
  }

  async update(userId: string, id: string, dto: UpdateFixedExpenseDto) {
    const existing = await this.prisma.fixedExpense.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      throw new NotFoundException('Fixed expense not found');
    }

    const updateData: Record<string, any> = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.amount !== undefined) updateData.amount = dto.amount;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    return this.prisma.fixedExpense.update({ where: { id }, data: updateData });
  }

  async remove(userId: string, id: string) {
    const existing = await this.prisma.fixedExpense.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      throw new NotFoundException('Fixed expense not found');
    }
    return this.prisma.fixedExpense.delete({ where: { id } });
  }
}
