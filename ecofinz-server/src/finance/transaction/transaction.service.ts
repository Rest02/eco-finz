import { FindAllTransactionsDto } from './dto/find-all-transactions.dto';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionType } from 'src/generated/prisma/enums';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    const { amount, type, date, description, accountId, categoryId } =
      createTransactionDto;

    const transactionDate = new Date(date);
    const month = transactionDate.getMonth() + 1; 
    const year = transactionDate.getFullYear();

    const [account, category] = await Promise.all([
      this.prisma.account.findUnique({ where: { id: accountId } }),
      this.prisma.category.findUnique({ where: { id: categoryId } }),
    ]);

    if (!account || !category) {
      throw new NotFoundException('Account or Category not found.');
    }

    if (account.userId !== userId || category.userId !== userId) {
      throw new UnauthorizedException(
        'Account or Category does not belong to the user.',
      );
    }

    const monthlySummary = await this.prisma.monthlySummary.upsert({
      where: { userId_month_year: { userId, month, year } },
      update: {},
      create: { userId, month, year },
    });

    const amountInDecimal =
      type === TransactionType.INGRESO ? amount : -amount;

    return this.prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: amountInDecimal,
          },
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          amount,
          type,
          description,
          date: transactionDate,
          userId,
          accountId,
          categoryId,
          monthlySummaryId: monthlySummary.id,
        },
      });

      return transaction;
    });
  }

  async findAll(userId: string, query: FindAllTransactionsDto) {
    const {
      page = 1,
      limit = 10,
      startDate,
      endDate,
      accountId,
      categoryId,
      type,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (startDate) {
      where.date = { ...where.date, gte: new Date(startDate) };
    }
    if (endDate) {
      where.date = { ...where.date, lte: new Date(endDate) };
    }
    if (accountId) {
      where.accountId = accountId;
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (type) {
      where.type = type;
    }

    const [transactions, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          date: 'desc',
        },
        include: {
          account: {
            select: { id: true, name: true, type: true },
          },
          category: {
            select: { id: true, name: true, type: true },
          },
        },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID #${id} not found`);
    }

    if (transaction.userId !== userId) {
      throw new UnauthorizedException('Access to this resource is forbidden');
    }

    return transaction;
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    userId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const originalTransaction = await tx.transaction.findUnique({
        where: { id },
      });

      if (!originalTransaction) {
        throw new NotFoundException(`Transaction with ID #${id} not found`);
      }
      if (originalTransaction.userId !== userId) {
        throw new UnauthorizedException('Access to this resource is forbidden');
      }

      // 1. Revert the old financial impact
      const originalAmount = originalTransaction.amount as unknown as number;
      const revertAmount =
        originalTransaction.type === TransactionType.INGRESO
          ? -originalAmount
          : originalAmount;

      await tx.account.update({
        where: { id: originalTransaction.accountId },
        data: { balance: { increment: revertAmount } },
      });

      // 2. Prepare new transaction data
      const newDetails = {
        ...originalTransaction,
        ...updateTransactionDto,
      };
      const newAmount = newDetails.amount as unknown as number;
      const newAccountId = newDetails.accountId;

      // 3. Apply the new financial impact
      const impactAmount =
        newDetails.type === TransactionType.INGRESO ? newAmount : -newAmount;

      await tx.account.update({
        where: { id: newAccountId },
        data: { balance: { increment: impactAmount } },
      });

      // 4. Handle MonthlySummary if date changes
      let monthlySummaryId = originalTransaction.monthlySummaryId;
      if (updateTransactionDto.date) {
        const newDate = new Date(updateTransactionDto.date);
        const originalDate = new Date(originalTransaction.date);

        if (
          newDate.getMonth() !== originalDate.getMonth() ||
          newDate.getFullYear() !== originalDate.getFullYear()
        ) {
          const month = newDate.getMonth() + 1;
          const year = newDate.getFullYear();
          const summary = await tx.monthlySummary.upsert({
            where: { userId_month_year: { userId, month, year } },
            create: { userId, month, year },
            update: {},
          });
          monthlySummaryId = summary.id;
        }
      }

      // 5. Update the transaction itself
      const updatedTransaction = await tx.transaction.update({
        where: { id },
        data: {
          ...updateTransactionDto,
          amount: updateTransactionDto.amount,
          date: updateTransactionDto.date ? new Date(updateTransactionDto.date) : undefined,
          monthlySummaryId,
        },
      });

      return updatedTransaction;
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findUnique({
        where: { id },
      });

      if (!transaction) {
        throw new NotFoundException(`Transaction with ID #${id} not found`);
      }
      if (transaction.userId !== userId) {
        throw new UnauthorizedException('Access to this resource is forbidden');
      }

      // Revert the balance change on the account
      const amount = transaction.amount as unknown as number;
      const revertAmount =
        transaction.type === TransactionType.INGRESO ? -amount : amount;

      await tx.account.update({
        where: { id: transaction.accountId },
        data: {
          balance: {
            increment: revertAmount,
          },
        },
      });

      // Delete the transaction
      await tx.transaction.delete({
        where: { id },
      });

      return { message: 'Transaction successfully deleted.' };
    });
  }
}
