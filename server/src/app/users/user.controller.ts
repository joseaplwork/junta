import { Controller, Get, Post } from '@nestjs/common';

import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get('/users')
  getData() {
    return this.appService.findAll();
  }

  @Post('/users')
  setUser() {
    return this.appService.setUser();
  }
}
