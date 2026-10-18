import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common'

import {
  ApiResource,
  MyJuntaDetailResponse,
  MyJuntaSummaryResponse,
  Permission,
} from '@junta/contracts'

import { CurrentParticipant } from '@/api/common/decorators/current-participant.decorator'
import { RequirePermissions } from '@/api/common/decorators/require-permissions.decorator'

import { MeService } from './me.service'

@Controller(ApiResource.me)
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get('juntas')
  @RequirePermissions(Permission.SELF_READ)
  findMyJuntas(
    @CurrentParticipant() participantId: string,
  ): Promise<MyJuntaSummaryResponse[]> {
    return this.meService.findMyJuntas(participantId)
  }

  @Get('juntas/:id')
  @RequirePermissions(Permission.SELF_READ)
  findMyJunta(
    @CurrentParticipant() participantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MyJuntaDetailResponse> {
    return this.meService.findMyJunta(participantId, id)
  }
}
