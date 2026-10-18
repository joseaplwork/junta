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

import { RequirePermissions } from '@/api/common/decorators/require-permissions.decorator'

import { CreateParticipantDto } from './dto/create-participant.dto'
import { UpdateParticipantDto } from './dto/update-participant.dto'
import { ParticipantsService } from './participants.service'

@Controller(ApiResource.participants)
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post()
  @RequirePermissions(Permission.PARTICIPANT_CREATE)
  create(@Body() dto: CreateParticipantDto): Promise<ParticipantResponse> {
    return this.participantsService.create(dto)
  }

  @Get()
  @RequirePermissions(Permission.PARTICIPANT_READ)
  findAll(): Promise<ParticipantResponse[]> {
    return this.participantsService.findAll()
  }

  @Get(':id')
  @RequirePermissions(Permission.PARTICIPANT_READ)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ParticipantResponse> {
    return this.participantsService.findOne(id)
  }

  @Get(':id/juntas')
  @RequirePermissions(Permission.PARTICIPANT_READ)
  findJuntas(@Param('id', ParseUUIDPipe) id: string): Promise<JuntaResponse[]> {
    return this.participantsService.findJuntas(id)
  }

  @Patch(':id')
  @RequirePermissions(Permission.PARTICIPANT_UPDATE)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateParticipantDto,
  ): Promise<ParticipantResponse> {
    return this.participantsService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.PARTICIPANT_DELETE)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.participantsService.remove(id)
  }
}
