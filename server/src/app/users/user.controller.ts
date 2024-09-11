import { Body, Controller, Get, Post } from '@nestjs/common';

import { Roles } from '@server/decorators';
import { Role } from '@server/enums';

import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get('/users')
  @Roles(Role.Admin)
  getAllUsers() {
    return this.appService.findAll();
  }

  @Post('/users')
  @Roles(Role.Admin)
  createUser(
    @Body('name') name: string,
    @Body('surname') surname: string,
    @Body('phone') phoneNumber: string,
  ) {
    return this.appService.createOne({ name, surname, phoneNumber });
  }
}
