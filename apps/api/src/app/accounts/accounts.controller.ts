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

import { AccountResponse, ApiResource, Permission } from '@junta/contracts'

import { RequirePermissions } from '@/api/common/decorators/require-permissions.decorator'

import { AccountsService } from './accounts.service'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'

@Controller(ApiResource.accounts)
export class AccountsController {
  constructor(private readonly adminsService: AccountsService) {}

  @Post()
  @RequirePermissions(Permission.ACCOUNT_CREATE)
  create(@Body() dto: CreateAccountDto): Promise<AccountResponse> {
    return this.adminsService.create(dto)
  }

  @Get()
  @RequirePermissions(Permission.ACCOUNT_READ)
  findAll(): Promise<AccountResponse[]> {
    return this.adminsService.findAll()
  }

  @Get(':id')
  @RequirePermissions(Permission.ACCOUNT_READ)
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<AccountResponse> {
    return this.adminsService.findOne(id)
  }

  @Patch(':id')
  @RequirePermissions(Permission.ACCOUNT_UPDATE)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAccountDto,
  ): Promise<AccountResponse> {
    return this.adminsService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.ACCOUNT_DELETE)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.adminsService.remove(id)
  }
}
