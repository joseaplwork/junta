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

import { Permissions } from '@/api/decorators/permissions.decorator'

import { ParticipantUpdatePayload } from './participant.interface'
import { ParticipantService } from './participant.service'

@Controller('participant')
export class ParticipantController {
  constructor(private readonly app: ParticipantService) {}

  @Get()
  @Permissions(Permission.PARTICIPANT_READ)
  getAllParticipants() {
    return this.app.findAll()
  }

  @Get(':id')
  @Permissions(Permission.PARTICIPANT_READ)
  getParticipantById(@Param('id') id: string) {
    return this.app.findOneById(id)
  }

  @Post()
  @Permissions(Permission.PARTICIPANT_CREATE)
  createParticipant(
    @Body('name') name: string,
    @Body('surname') surname: string,
    @Body('phoneNumber') phoneNumber: string,
  ) {
    return this.app.createOne({ name, surname, phoneNumber })
  }

  @Patch(':id')
  @Permissions(Permission.PARTICIPANT_UPDATE)
  updateParticipant(
    @Param('id') id: string,
    @Body('name') name?: string,
    @Body('surname') surname?: string,
    @Body('phoneNumber') phoneNumber?: string,
  ) {
    const data: ParticipantUpdatePayload = {}
    if (name !== undefined) data.name = name
    if (surname !== undefined) data.surname = surname
    if (phoneNumber !== undefined) data.phoneNumber = phoneNumber
    return this.app.update(id, data)
  }

  @Delete(':id')
  @Permissions(Permission.PARTICIPANT_DELETE)
  async deleteParticipant(@Param('id') id: string) {
    await this.app.remove(id)
    return { success: true }
  }
}
