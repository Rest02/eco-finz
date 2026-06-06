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
import { MonthlyProjectionService } from './monthly-projection.service';
import { CreateMonthlyProjectionDto } from './dto/create-monthly-projection.dto';
import { UpdateMonthlyProjectionDto } from './dto/update-monthly-projection.dto';
import { UpdateSpendingPlanDto } from './dto/update-spending-plan.dto';
import { QueryMonthlyProjectionDto } from './dto/query-monthly-projection.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('finance/monthly-projection')
export class MonthlyProjectionController {
  constructor(private readonly service: MonthlyProjectionService) {}

  @Post()
  create(@Body() dto: CreateMonthlyProjectionDto, @Request() req) {
    return this.service.create(req.user.id, dto);
  }

  @Get()
  findAll(@Request() req, @Query() query: QueryMonthlyProjectionDto) {
    return this.service.findAll(req.user.id, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.service.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMonthlyProjectionDto,
    @Request() req,
  ) {
    return this.service.update(req.user.id, id, dto);
  }

  @Patch(':id/spending-plan')
  updateSpendingPlan(
    @Param('id') id: string,
    @Body() dto: UpdateSpendingPlanDto,
    @Request() req,
  ) {
    return this.service.updateSpendingPlan(req.user.id, id, dto);
  }

  @Post(':id/duplicate')
  duplicate(@Param('id') id: string, @Request() req) {
    return this.service.duplicate(req.user.id, id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.service.remove(req.user.id, id);
  }
}
