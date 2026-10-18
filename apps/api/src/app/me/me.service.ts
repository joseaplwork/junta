import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

import { MyJuntaDetailResponse, MyJuntaSummaryResponse } from '@junta/contracts'

import { Junta } from '@/api/juntas/entities/junta.entity'

import { toMyJuntaDetail, toMyJuntaSummary } from './me.mapper'

const FULL_GROUPS = { groups: { participantGroups: { participant: true } } }

/** Reads for the signed-in participant, limited by BR-15. */
@Injectable()
export class MeService {
  constructor(
    @InjectRepository(Junta)
    private readonly juntas: Repository<Junta>,
  ) {}

  async findMyJuntas(participantId: string): Promise<MyJuntaSummaryResponse[]> {
    // Filtering on the relation would also trim the loaded members, so find
    // the ids first, then load each junta whole.
    const memberOf = await this.juntas.find({
      select: { id: true },
      where: { groups: { participantGroups: { participantId } } },
    })

    if (memberOf.length === 0) return []

    const juntas = await this.juntas.find({
      where: { id: In(memberOf.map(junta => junta.id)) },
      relations: FULL_GROUPS,
      order: { startDate: 'DESC' },
    })

    return juntas.flatMap(junta => toMyJuntaSummary(junta, participantId) ?? [])
  }

  /** 404 for juntas the participant is not in, so their existence stays hidden. */
  async findMyJunta(
    participantId: string,
    id: string,
  ): Promise<MyJuntaDetailResponse> {
    const junta = await this.juntas.findOne({
      where: { id },
      relations: FULL_GROUPS,
    })
    const detail = junta ? toMyJuntaDetail(junta, participantId) : undefined

    if (!detail) throw new NotFoundException(`Junta ${id} not found`)

    return detail
  }
}
