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

import {
  ApiResource,
  JuntaDetailResponse,
  JuntaResponse,
  Permission,
} from '@junta/contracts'

import { AuthenticatedAccount } from '@/api/common/auth/authenticated-account'
import { CurrentAccount } from '@/api/common/decorators/current-account.decorator'
import { RequirePermissions } from '@/api/common/decorators/require-permissions.decorator'

import { CreateJuntaDto } from './dto/create-junta.dto'
import { UpdateJuntaDto } from './dto/update-junta.dto'
import { JuntasService } from './juntas.service'

@Controller(ApiResource.juntas)
export class JuntasController {
  constructor(private readonly juntasService: JuntasService) {}

  @Post()
  @RequirePermissions(Permission.JUNTA_CREATE)
  create(
    @Body() dto: CreateJuntaDto,
    @CurrentAccount() viewer: AuthenticatedAccount,
  ): Promise<JuntaResponse> {
    return this.juntasService.create(dto, viewer)
  }

  @Get()
  @RequirePermissions(Permission.JUNTA_READ)
  findAll(
    @CurrentAccount() viewer: AuthenticatedAccount,
  ): Promise<JuntaResponse[]> {
    return this.juntasService.findAll(viewer)
  }

  @Get(':id')
  @RequirePermissions(Permission.JUNTA_READ)
  findOne(
    @CurrentAccount() viewer: AuthenticatedAccount,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<JuntaDetailResponse> {
    return this.juntasService.findOne(viewer, id)
  }

  @Patch(':id')
  @RequirePermissions(Permission.JUNTA_UPDATE)
  update(
    @CurrentAccount() viewer: AuthenticatedAccount,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateJuntaDto,
  ): Promise<JuntaResponse> {
    return this.juntasService.update(viewer, id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.JUNTA_DELETE)
  remove(
    @CurrentAccount() viewer: AuthenticatedAccount,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.juntasService.remove(viewer, id)
  }
}
