import { Body, Controller, Post } from '@nestjs/common'

import { Permission } from '@junta/access/enums/permission'
import { Role } from '@junta/access/enums/role'

import { Permissions } from '@/api/decorators/permissions.decorator'

import { Admin } from './admin.entity'
import { AdminService } from './admin.service'

@Controller()
export class AdminController {
  constructor(private readonly admin: AdminService) {}

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
