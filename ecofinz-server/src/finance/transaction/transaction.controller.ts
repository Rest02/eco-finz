import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FindAllTransactionsDto } from './dto/find-all-transactions.dto';

@UseGuards(JwtAuthGuard)
@Controller('finance/transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto, @Request() req) {
    const userId = req.user.id;
    return this.transactionService.create(createTransactionDto, userId);
  }

  @Get()
  findAll(@Request() req, @Query() query: FindAllTransactionsDto) {
    const userId = req.user.id;
    return this.transactionService.findAll(userId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.transactionService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.transactionService.update(id, updateTransactionDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.transactionService.remove(id, userId);
  }
}
