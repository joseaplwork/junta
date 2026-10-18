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

import { AuthenticatedAdmin } from '@/api/common/auth/authenticated-admin'
import { CurrentAdmin } from '@/api/common/decorators/current-admin.decorator'
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
    @CurrentAdmin() admin: AuthenticatedAdmin,
  ): Promise<JuntaResponse> {
    return this.juntasService.create(dto, admin.id)
  }

  @Get()
  @RequirePermissions(Permission.JUNTA_READ)
  findAll(): Promise<JuntaResponse[]> {
    return this.juntasService.findAll()
  }

  @Get(':id')
  @RequirePermissions(Permission.JUNTA_READ)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<JuntaDetailResponse> {
    return this.juntasService.findOne(id)
  }

  @Patch(':id')
  @RequirePermissions(Permission.JUNTA_UPDATE)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateJuntaDto,
  ): Promise<JuntaResponse> {
    return this.juntasService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.JUNTA_DELETE)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.juntasService.remove(id)
  }
}
