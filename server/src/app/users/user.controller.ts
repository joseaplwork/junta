import { Body, Controller, Get, Post } from '@nestjs/common';

import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get('/users')
  getData() {
    return this.appService.findAll();
  }

  @Post('/users')
  setUser(
    @Body('name') name: string,
    @Body('surname') surname: string,
    @Body('phone') phone: string,
  ) {
    return this.appService.createOne(name, surname, phone);
  }
}
