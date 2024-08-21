import { Body, Controller, Post } from '@nestjs/common';

import { Admin } from './admin.entity';
import { AdminService } from './admin.service';

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/signup')
  async createUser(
    @Body('password') password: string,
    @Body('email') email: string,
    @Body('name') name: string,
    @Body('surname') surname: string,
    @Body('phone') phone: string,
  ): Promise<Admin> {
    const result = await this.adminService.createOne(
      email,
      password,
      name,
      surname,
      phone,
    );

    return result;
  }
}
