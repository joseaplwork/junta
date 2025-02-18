import { Permissions } from '@/server/decorators'
import { Permission } from '@/server/enums'
import { Body, Controller, Get, Post } from '@nestjs/common'

import { UserService } from './user.service'

@Controller()
export class UserController {
  constructor(private readonly app: UserService) {}

  @Get('/user')
  @Permissions(Permission.USER_READ)
  getAllUsers() {
    return this.app.findAll()
  }

  @Post('/user')
  @Permissions(Permission.USER_CREATE)
  createUser(
    @Body('name') name: string,
    @Body('surname') surname: string,
    @Body('phone') phoneNumber: string,
  ) {
    return this.app.createOne({ name, surname, phoneNumber })
  }
}
