import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common'

import { AdminResponse, ApiResource, Permission } from '@junta/contracts'

import { RequirePermissions } from '@/api/common/decorators/require-permissions.decorator'

import { AdminsService } from './admins.service'
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminDto } from './dto/update-admin.dto'

@Controller(ApiResource.admins)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  @RequirePermissions(Permission.ADMIN_CREATE)
  create(@Body() dto: CreateAdminDto): Promise<AdminResponse> {
    return this.adminsService.create(dto)
  }

  @Get()
  @RequirePermissions(Permission.ADMIN_READ)
  findAll(): Promise<AdminResponse[]> {
    return this.adminsService.findAll()
  }

  @Get(':id')
  @RequirePermissions(Permission.ADMIN_READ)
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<AdminResponse> {
    return this.adminsService.findOne(id)
  }

  @Patch(':id')
  @RequirePermissions(Permission.ADMIN_UPDATE)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAdminDto,
  ): Promise<AdminResponse> {
    return this.adminsService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.ADMIN_DELETE)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.adminsService.remove(id)
  }
}
