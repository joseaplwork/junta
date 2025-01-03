import { Body, Controller, Get, Post } from '@nestjs/common';

import { Permissions } from '@server/decorators/permissions.decorator';
import { Permission } from '@server/enums/permission.enum';

import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly app: UserService) {}

  @Get('/user')
  @Permissions(Permission.UserRead)
  getAllUsers() {
    return this.app.findAll();
  }

  @Post('/user')
  @Permissions(Permission.UserCreate)
  createUser(
    @Body('name') name: string,
    @Body('surname') surname: string,
    @Body('phone') phoneNumber: string,
  ) {
    return this.app.createOne({ name, surname, phoneNumber });
  }
}
