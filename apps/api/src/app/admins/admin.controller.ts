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
import { Role } from '@junta/shared/enums/role'

import { Permissions } from '@/api/decorators/permissions.decorator'

import { Admin } from './admin.entity'
import { AdminUpdatePayload } from './admin.interface'
import { AdminService } from './admin.service'

@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get()
  @Permissions(Permission.ADMIN_READ)
  async getAdmins(): Promise<Admin[]> {
    return this.admin.findAll()
  }

  @Get(':id')
  @Permissions(Permission.ADMIN_READ)
  async getAdmin(@Param('id') id: string): Promise<Admin> {
    return this.admin.findOneById(id)
  }

  @Post()
  @Permissions(Permission.ADMIN_CREATE)
  async createAdmin(
    @Body('password') plainPassword: string,
    @Body('email') email: string,
    @Body('roles') roles: Role[],
    @Body('name') name: string,
    @Body('surname') surname: string,
    @Body('phoneNumber') phoneNumber: string,
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

  @Patch(':id')
  @Permissions(Permission.ADMIN_UPDATE)
  async updateAdmin(
    @Param('id') id: string,
    @Body() updateData: AdminUpdatePayload,
  ): Promise<Admin> {
    return this.admin.update(id, updateData)
  }

  @Delete(':id')
  @Permissions(Permission.ADMIN_DELETE)
  async deleteAdmin(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.admin.delete(id)

    return { success: true }
  }
}
