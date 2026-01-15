import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from '../../prisma/prisma.service'; // Import PrismaService

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {} // Inject PrismaService

  create(userId: string, createAccountDto: CreateAccountDto) {
    return this.prisma.account.create({
      data: {
        ...createAccountDto,
        userId,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.account.findMany({
      where: { userId },
    });
  }

  async findOne(userId: string, id: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account || account.userId !== userId) {
      throw new Error('Account not found or user not authorized'); // TODO: Use a proper NestJS exception
    }
    return account;
  }

  async update(userId: string, id: string, updateAccountDto: UpdateAccountDto) {
    await this.findOne(userId, id); // Check if the account belongs to the user

    return this.prisma.account.update({
      where: { id },
      data: updateAccountDto,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id); // Check if the account belongs to the user

    return this.prisma.account.delete({
      where: { id },
    });
  }
}
