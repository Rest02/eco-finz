
import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User as UserModel } from '../generated/prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getUsers(): Promise<UserModel[]> {
    return this.userService.users({});
  }

  @Post()
  async signupUser(
    @Body() userData: { name?: string; email: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }
}
