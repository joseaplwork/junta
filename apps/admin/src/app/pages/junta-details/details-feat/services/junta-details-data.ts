import { Injectable, inject } from '@angular/core'

import { GroupConfig } from '@/admin/shared/interfaces/group'
import { Junta, JuntaDTO } from '@/admin/shared/interfaces/junta'
import { Api } from '@/admin/shared/services/api'

export interface GroupDTO {
  id: string
  name: string | null
  order: number
  participantsGroups?: {
    participant: {
      id: string
      name: string
      surname: string
    }
  }[]
}

export interface JuntaWithGroupsDTO extends Omit<JuntaDTO, 'groups'> {
  groupList?: GroupDTO[]
}

export interface GroupWithParticipants extends GroupConfig {
  participants: {
    id: string
    name: string
    surname: string
  }[]
}

export interface JuntaWithGroups extends Junta {
  groupList: GroupWithParticipants[]
}

@Injectable({ providedIn: 'root' })
export class JuntaDetailsData {
  private readonly _api = inject(Api)

  async fetchById(id: string): Promise<JuntaWithGroups> {
    const response = await this._api.get<JuntaWithGroupsDTO>(`/junta/${id}`)

    return this._transform(response)
  }

  private _transform = (dto: JuntaWithGroupsDTO): JuntaWithGroups => {
    const groupsCount = dto.groupList?.length || 0

    const junta: Junta = {
      id: dto.id,
      name: dto.name,
      amount: dto.amount,
      groups: groupsCount,
      partialAmount: dto.partial_amount,
      startDate: dto.start_date,
      endDate: dto.end_date,
      active: dto.active,
      adminId: dto.admin_id,
    }

    const groups: GroupWithParticipants[] =
      dto.groupList?.map(group => ({
        name: group.name || undefined,
        order: group.order,
        participantIds:
          group.participantsGroups?.map(pg => pg.participant.id) || [],
        participants:
          group.participantsGroups?.map(pg => ({
            id: pg.participant.id,
            name: pg.participant.name,
            surname: pg.participant.surname,
          })) || [],
      })) || []

    return {
      ...junta,
      groupList: groups,
    }
  }
}
