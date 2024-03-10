import { Controller, Post } from '@nestjs/common';

import { AdminService } from './admin.service';

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/admin')
  setAdmin() {
    return this.adminService.findOne('test');
  }
}
