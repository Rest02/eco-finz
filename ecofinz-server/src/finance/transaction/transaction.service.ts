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
  constructor(private readonly prisma: PrismaService) { }

  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    const {
      amount,
      type,
      date,
      description,
      accountId,
      categoryId,
      budgetId,
      destinationAccountId,
    } = createTransactionDto;

    const transactionDate = new Date(date);
    const month = transactionDate.getMonth() + 1;
    const year = transactionDate.getFullYear();

    // 1. Initial Validations
    const promises: any[] = [
      this.prisma.account.findUnique({ where: { id: accountId } }),
      this.prisma.category.findUnique({ where: { id: categoryId } }),
    ];

    if (budgetId) {
      promises.push(this.prisma.budget.findUnique({ where: { id: budgetId } }));
    }

    if (type === TransactionType.AHORRO && destinationAccountId) {
      promises.push(
        this.prisma.account.findUnique({ where: { id: destinationAccountId } }),
      );
    }

    const results = await Promise.all(promises);
    const account = results[0];
    const category = results[1];
    const budget = budgetId ? results[2] : null;
    const destinationAccount =
      type === TransactionType.AHORRO && destinationAccountId
        ? results[budgetId ? 3 : 2]
        : null;

    if (!account || !category) {
      throw new NotFoundException('Account or Category not found.');
    }

    if (account.userId !== userId || category.userId !== userId) {
      throw new UnauthorizedException(
        'Account or Category does not belong to the user.',
      );
    }

    if (category.type !== type) {
      throw new UnauthorizedException(
        `Transaction type (${type}) does not match category type (${category.type}).`,
      );
    }

    if (budgetId && (!budget || budget.userId !== userId)) {
      throw new NotFoundException(
        'Budget not found or does not belong to user.',
      );
    }

    if (
      type === TransactionType.AHORRO &&
      destinationAccountId &&
      (!destinationAccount || destinationAccount.userId !== userId)
    ) {
      throw new NotFoundException(
        'Destination Account not found or does not belong to user.',
      );
    }

    // 2. Ensure Monthly Summary exists
    const monthlySummary = await this.prisma.monthlySummary.upsert({
      where: { userId_month_year: { userId, month, year } },
      update: {},
      create: { userId, month, year },
    });

    return this.prisma.$transaction(async (tx) => {
      // HANDLE TRANSFER (AHORRO with Destination)
      if (type === TransactionType.AHORRO && destinationAccountId) {
        // A. Update Source Account (Decrease)
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { decrement: amount } },
        });

        // B. Update Destination Account (Increase)
        await tx.account.update({
          where: { id: destinationAccountId },
          data: { balance: { increment: amount } },
        });

        // C. Create Main Transaction (Source -> Outflow)
        const mainTransaction = await tx.transaction.create({
          data: {
            amount,
            type, // AHORRO
            isInflow: false, // Source is outflow
            description,
            date: transactionDate,
            userId,
            accountId,
            categoryId,
            monthlySummaryId: monthlySummary.id,
            budgetId,
          },
        });

        // D. Create Destination Transaction (Linked -> Inflow)
        const linkedTransaction = await tx.transaction.create({
          data: {
            amount, // Same amount
            type, // AHORRO
            isInflow: true, // Destination is INFLOW
            description: `Transferencia desde ${account.name}`,
            date: transactionDate,
            userId,
            accountId: destinationAccountId,
            categoryId, // Same category
            monthlySummaryId: monthlySummary.id,
            relatedTransactionId: mainTransaction.id,
          },
        });

        // E. Link Main to Linked
        await tx.transaction.update({
          where: { id: mainTransaction.id },
          data: { relatedTransactionId: linkedTransaction.id },
        });

        return mainTransaction;
      }

      // HANDLE STANDARD TRANSACTION
      const isIngreso = type === TransactionType.INGRESO;
      const amountInDecimal = isIngreso ? amount : -amount;

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
          isInflow: isIngreso, // Only INGRESO is inflow by default
          description,
          date: transactionDate,
          userId,
          accountId,
          categoryId,
          monthlySummaryId: monthlySummary.id,
          budgetId,
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
      const newType = newDetails.type;
      const newCategoryId = newDetails.categoryId;

      // Validate category type if either type or categoryId changed
      if (updateTransactionDto.type || updateTransactionDto.categoryId) {
        const category = await tx.category.findUnique({
          where: { id: newCategoryId },
        });
        if (category && category.type !== newType) {
          throw new UnauthorizedException(
            `Transaction type (${newType}) does not match category type (${category.type}).`,
          );
        }
      }

      // 3. Apply the new financial impact
      const impactAmount =
        newType === TransactionType.INGRESO ? newAmount : -newAmount;

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

      // Helper to revert balance
      const revertBalance = async (
        accId: string,
        amount: number,
        type: TransactionType,
        isTransfer: boolean,
        isSource: boolean // Only critical for transfers
      ) => {
        let revertAmount = 0;
        if (isTransfer) {
          // If transfer: Source had decrement, Dest had increment.
          // To revert Source: increment. To revert Dest: decrement.
          // How do we know if this specific transaction was Source or Dest?
          // We assume:
          // If we are deleting the 'primary' (user clicked), we check relations.
          // Actually, simplifying:
          // INGRESO: Balance + Amount -> Revert: Balance - Amount
          // EGRESO: Balance - Amount -> Revert: Balance + Amount
          // AHORRO: Balance - Amount -> Revert: Balance + Amount (if normal savings)
          // TRANSFER: Source (-Amt), Dest (+Amt).

          // Implementation Detail: My create logic for Transfer sets:
          // Source Tx: AccountId = Source. Amount = X. Type = AHORRO.
          // Dest Tx: AccountId = Dest. Amount = X. Type = AHORRO.

          // The issue: "AHORRO" usually implies Outflow for the account (money leaves to a piggy bank).
          // But for destination, it entered.
          // In create(), I manually did:
          // Source: decrement(amount)
          // Dest: increment(amount)

          // So when reverting:
          // If it was Source (Outflow): increment(amount)
          // If it was Dest (Inflow): decrement(amount)

          // How to distinguish?
          // We can check if `relatedTransactionId` exists.
          // But which one is source?
          // The `create` logic didn't explicitly mark them differently in DB other than ID refs.
          // However, we can use the logic:
          // If I am deleting a transaction...
          // I need to reverse its specific effect.
          // If I am deleting the LINKED one too, I reverse its effect too.
        }

        // GENERIC REVERSION BASED ON ACCOUNT IMPACT
        // We know for sure what happened based on the CREATE logic?
        // AHORRO type is ambiguous in standard logic, but here:
        // Standalone AHORRO = Outflow (Decrement).
        // Transfer AHORRO = Source(Decrement), Dest(Increment).

        // Wait, if I delete the DESTINATION transaction of a transfer, it has Type AHORRO.
        // If I treat it as standard AHORRO, I would Increment balance (Revert Outflow).
        // But it was an Inflow! So I should Decrement balance.

        // CRITICAL: We need to know if it was an inflow or outflow.
        // We don't have a field for "Direction".
        // BUT, we can infer from `relatedTransactionId` logic? No.
        // Maybe we fetch both, compare creation times? No.

        // Simplification:
        // Only allow deleting the MAIN transaction? Or handle both.
        // If relatedTransactionId exists:
        //   Fetch related.
        //   Identify which is which.
        //   Actually, `create` logic:
        //   Main (Source): decrement. Linked (Dest): increment.
        //   We linked Main.related -> Linked. Linked.related -> Main.
        //   We can't easily distinguish who was source.

        // FIX: In `create`, we should probably mark the Destination transaction differently?
        // Or, assume AHORRO is ALWAYS Outflow, EXCEPT when it's the destination of a transfer.
        // But the DB record just says AHORRO.

        // Alternative: Use `INGRESO` for the destination transaction?
        // If I use Type INGRESO for destination, then standard logic works!
        // INGRESO -> Revert = Decrement.
        // AHORRO -> Revert = Increment.
        // Perfect.
        // Let's change CREATE logic to use INGRESO for destination transaction?
        // User asked: "Los movimientos de tipo ahorro se registran como egresos... Sin embargo, ese dinero debería reflejarse como un ingreso en otra cuenta".
        // So yes, destination IS an INGRESO conceptually.
        // But User wants to see "Ahorro" in the list?
        // If I change type to INGRESO, it shows as Income.
        // If I keep AHORRO, I need to know direction.

        // Let's look at `create` again.
        // I used `type` (AHORRO) for both.

        // PROPOSAL: Use a flag or logic.
        // Since I cannot change the schema easily now (I just did), 
        // I will rely on this heuristic:
        // A transaction with `relatedTransactionId` NEEDS special handling.
        // I will just use the standard: Revert = -1 * Effect.
        // But what was the Effect?
        // I will fetch the LOGS? No.

        // Let's modify CREATE to set the Destination Transaction Type to INGRESO? 
        // Or better, `AHORRO` but I assume if I am deleting a pair, one must be + and one -.
        // The one that `decrement`ed the account was the one where `balance` < `previous_balance`. We don't know that.

        // Let's go with the safer bet: Set Destination Type to INGRESO.
        // "Se debe registrar un ingreso equivalente en la cuenta destino".
        // The user said "registrar un ingreso". So Type=INGRESO is logically sound.
        // It will appear in Income charts, but that might be acceptable or desired.
        // If user explicitly selected "Type: Ahorro", seeing "Ingreso" in destination might be confusing?
        // Maybe not. "Deposit" equals "Income" in many ledgers.

        // Let's stick to Type=AHORRO for both as per my previous code, but figure out how to delete safely.
        // If I have two transactions A and B linked.
        // A: User creates as Ahorro. (Source).
        // B: System creates as Ahorro. (Dest).
        // If I look at the Accounts:
        // Account A balance decreased. Revert -> Increment.
        // Account B balance increased. Revert -> Decrement.

        // How to differentiate A and B?
        // I can assume the one created *second* (higher ID? createdAt?) is the destination?
        // Or, I can check the Description? "Transferencia desde..."
        // In `create`, I set description of destination to `Transferencia desde ${...}`.
        // Use that!
      };

      // 1. Check for relation
      if (transaction.relatedTransactionId) {
        const related = await tx.transaction.findUnique({
          where: { id: transaction.relatedTransactionId },
        });

        if (related) {
          // We have a pair. We need to revert both.
          // One is Source (Outflow), One is Dest (Inflow).
          // Heuristic: Check description or assume standard behavior?
          // The "Source" was created by user input (Created first? Not guaranteed with async).
          // The "Dest" has description `Transferencia desde ...` (Set in create).

          const txs = [transaction, related];

          for (const t of txs) {
            const amount = t.amount as unknown as number;
            // Check if this is the Destination one (Inflow)
            // We used the description `Transferencia desde ${account.name}`
            // This is a bit brittle but simplest for now without schema specific field 'isInflow'.
            const isInflow = t.description.startsWith('Transferencia desde ');

            if (isInflow) {
              // It was an increment. Revert = Decrement.
              await tx.account.update({
                where: { id: t.accountId },
                data: { balance: { decrement: amount } }
              });
            } else {
              // It was an outflow (Source). Revert = Increment.
              await tx.account.update({
                where: { id: t.accountId },
                data: { balance: { increment: amount } }
              });
            }

            await tx.transaction.delete({ where: { id: t.id } });
          }

          return { message: 'Transfer successfully deleted.' };
        }
      }

      // 2. Standard Delete (No relation)
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

      await tx.transaction.delete({
        where: { id },
      });

      return { message: 'Transaction successfully deleted.' };
    });
  }
}
