import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Request } from 'express'; // Import Request
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; // Import JwtAuthGuard

// Type for authenticated request
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email?: string;
    [key: string]: any;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('finance/accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() createAccountDto: CreateAccountDto) {
    const userId = req.user.id; // Assuming user ID is available on req.user.id
    return this.accountService.create(userId, createAccountDto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.accountService.findAll(userId);
  }

  @Get(':id')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const userId = req.user.id;
    return this.accountService.findOne(userId, id);
  }

  @Patch(':id')
  update(@Req() req: AuthenticatedRequest, @Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    const userId = req.user.id;
    return this.accountService.update(userId, id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const userId = req.user.id;
    return this.accountService.remove(userId, id);
  }
}
