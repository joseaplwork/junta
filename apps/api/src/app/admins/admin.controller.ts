import { Body, Controller, Get, Post } from '@nestjs/common'

import { Permission } from '@junta/shared/enums/permission'
import { Role } from '@junta/shared/enums/role'

import { Permissions } from '@/api/decorators/permissions.decorator'

import { Admin } from './admin.entity'
import { AdminService } from './admin.service'

@Controller()
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('/admin')
  @Permissions(Permission.ADMIN_READ)
  async getAdmins(): Promise<Admin[]> {
    return this.admin.findAll()
  }

  @Post('/admin')
  @Permissions(Permission.ADMIN_CREATE)
  async createAdmin(
    @Body('password') plainPassword: string,
    @Body('email') email: string,
    @Body('roles') roles: Role[],
    @Body('name') name: string,
    @Body('surname') surname: string,
    @Body('phone') phoneNumber: string,
  ): Promise<Admin> {
    const result = await this.admin.createOne({
      email,
      plainPassword,
      roles,
      name,
      surname,
      phoneNumber,
    })

    return result
  }
}
