import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'

import { Permission } from '@junta/shared/enums/permission'

import { Permissions } from '@/api/decorators/permissions.decorator'

import { UserUpdatePayload } from './user.interface'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly app: UserService) {}

  @Get()
  @Permissions(Permission.USER_READ)
  getAllUsers() {
    return this.app.findAll()
  }

  @Post()
  @Permissions(Permission.USER_CREATE)
  createUser(
    @Body('name') name: string,
    @Body('surname') surname: string,
    @Body('phone') phoneNumber: string,
  ) {
    return this.app.createOne({ name, surname, phoneNumber })
  }

  @Patch('/:id')
  @Permissions(Permission.USER_UPDATE)
  updateUser(
    @Param('id') id: string,
    @Body('name') name?: string,
    @Body('surname') surname?: string,
    @Body('phone') phoneNumber?: string,
  ) {
    const data: UserUpdatePayload = {}
    if (name !== undefined) data.name = name
    if (surname !== undefined) data.surname = surname
    if (phoneNumber !== undefined) data.phoneNumber = phoneNumber
    return this.app.update(id, data)
  }

  @Delete(':id')
  @Permissions(Permission.USER_DELETE)
  async deleteUser(@Param('id') id: string) {
    await this.app.remove(id)
    return { success: true }
  }
}
