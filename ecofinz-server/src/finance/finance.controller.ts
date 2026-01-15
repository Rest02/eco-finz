import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @UseGuards(JwtAuthGuard)
  @Get('summary/:year/:month')
  getSummary(
    @Param('year') year: string,
    @Param('month') month: string,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.financeService.getSummary(userId, +year, +month);
  }
}
