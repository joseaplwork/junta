import { Body, Controller, Post } from '@nestjs/common';

import { Roles } from '@server/decorators';
import { Role } from '@server/enums';

import { Admin } from './admin.entity';
import { AdminService } from './admin.service';

@Controller()
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Post('/signup')
  @Roles(Role.SuperAdmin)
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
    });

    return result;
  }
}
