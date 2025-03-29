import { Body, Controller, Get, Post } from '@nestjs/common'

import { Permission } from '@junta/shared/enums/permission'

import { Permissions } from '@/api/decorators/permissions.decorator'

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
