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
  JuntaResponse,
  ParticipantResponse,
  Permission,
} from '@junta/contracts'

import { AuthenticatedAccount } from '@/api/common/auth/authenticated-account'
import { CurrentAccount } from '@/api/common/decorators/current-account.decorator'
import { RequirePermissions } from '@/api/common/decorators/require-permissions.decorator'

import { CreateParticipantDto } from './dto/create-participant.dto'
import { UpdateParticipantDto } from './dto/update-participant.dto'
import { ParticipantsService } from './participants.service'

@Controller(ApiResource.participants)
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post()
  @RequirePermissions(Permission.PARTICIPANT_CREATE)
  create(
    @Body() dto: CreateParticipantDto,
    @CurrentAccount() viewer: AuthenticatedAccount,
  ): Promise<ParticipantResponse> {
    return this.participantsService.create(dto, viewer)
  }

  @Get()
  @RequirePermissions(Permission.PARTICIPANT_READ)
  findAll(
    @CurrentAccount() viewer: AuthenticatedAccount,
  ): Promise<ParticipantResponse[]> {
    return this.participantsService.findAll(viewer)
  }

  @Get(':id')
  @RequirePermissions(Permission.PARTICIPANT_READ)
  findOne(
    @CurrentAccount() viewer: AuthenticatedAccount,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ParticipantResponse> {
    return this.participantsService.findOne(viewer, id)
  }

  @Get(':id/juntas')
  @RequirePermissions(Permission.PARTICIPANT_READ)
  findJuntas(
    @CurrentAccount() viewer: AuthenticatedAccount,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<JuntaResponse[]> {
    return this.participantsService.findJuntas(viewer, id)
  }

  @Patch(':id')
  @RequirePermissions(Permission.PARTICIPANT_UPDATE)
  update(
    @CurrentAccount() viewer: AuthenticatedAccount,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateParticipantDto,
  ): Promise<ParticipantResponse> {
    return this.participantsService.update(viewer, id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.PARTICIPANT_DELETE)
  remove(
    @CurrentAccount() viewer: AuthenticatedAccount,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.participantsService.remove(viewer, id)
  }
}
