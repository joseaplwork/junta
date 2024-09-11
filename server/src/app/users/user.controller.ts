import { Body, Controller, Get, Post } from '@nestjs/common';

import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get('/users')
  getAllUsers() {
    return this.appService.findAll();
  }

  @Post('/users')
  createUser(
    @Body('name') name: string,
    @Body('surname') surname: string,
    @Body('phone') phoneNumber: string,
  ) {
    return this.appService.createOne({ name, surname, phoneNumber });
  }
}
