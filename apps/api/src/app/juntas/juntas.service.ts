import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, EntityManager, In, Repository } from 'typeorm'

import {
  GroupAssignment,
  JuntaDetailResponse,
  JuntaResponse,
} from '@junta/contracts'
import {
  assertValidGroupAssignments,
  calculateGroupAmount,
} from '@junta/domain'

import { CreateJuntaDto } from './dto/create-junta.dto'
import { UpdateJuntaDto } from './dto/update-junta.dto'
import { Group } from './entities/group.entity'
import { Junta } from './entities/junta.entity'
import { ParticipantGroup } from './entities/participant-group.entity'
import { toJuntaDetailResponse, toJuntaResponse } from './junta.mapper'

@Injectable()
export class JuntasService {
  constructor(
    @InjectRepository(Junta)
    private readonly juntas: Repository<Junta>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateJuntaDto, adminId: string): Promise<JuntaResponse> {
    assertValidGroupAssignments(dto.groups)

    const junta = await this.dataSource.transaction(async manager => {
      const saved = await manager.save(
        manager.create(Junta, {
          name: dto.name,
          amount: dto.amount,
          currency: dto.currency,
          groupCount: dto.groups.length,
          groupAmount: calculateGroupAmount(dto.amount, dto.groups.length),
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
          active: dto.active,
          adminId,
        }),
      )

      await this.saveGroups(manager, saved.id, dto.groups)

      return saved
    })

    return toJuntaResponse(junta)
  }

  async findAll(): Promise<JuntaResponse[]> {
    const juntas = await this.juntas.find({ order: { startDate: 'DESC' } })

    return juntas.map(toJuntaResponse)
  }

  async findOne(id: string): Promise<JuntaDetailResponse> {
    const junta = await this.juntas.findOne({
      where: { id },
      relations: { groups: { participantGroups: { participant: true } } },
    })

    if (!junta) {
      throw new NotFoundException(`Junta ${id} not found`)
    }

    return toJuntaDetailResponse(junta)
  }

  async update(id: string, dto: UpdateJuntaDto): Promise<JuntaResponse> {
    if (dto.groups) assertValidGroupAssignments(dto.groups)

    const saved = await this.dataSource.transaction(async manager => {
      const junta = await this.lockEntity(manager, id)

      if (dto.name !== undefined) junta.name = dto.name
      if (dto.currency !== undefined) junta.currency = dto.currency
      if (dto.amount !== undefined) junta.amount = dto.amount
      if (dto.startDate !== undefined) {
        junta.startDate = new Date(dto.startDate)
      }
      if (dto.endDate !== undefined) junta.endDate = new Date(dto.endDate)
      if (dto.active !== undefined) junta.active = dto.active
      if (dto.groups) {
        junta.groupCount = dto.groups.length
        await this.deleteGroups(manager, id)
        await this.saveGroups(manager, id, dto.groups)
      }
      junta.groupAmount = calculateGroupAmount(junta.amount, junta.groupCount)

      return manager.save(junta)
    })

    return toJuntaResponse(saved)
  }

  async remove(id: string): Promise<void> {
    await this.dataSource.transaction(async manager => {
      await this.lockEntity(manager, id)
      await this.deleteGroups(manager, id)
      await manager.delete(Junta, { id })
    })
  }

  /** Loads the junta with a row lock, so concurrent edits of one junta run one after another. */
  private async lockEntity(manager: EntityManager, id: string): Promise<Junta> {
    const junta = await manager.findOne(Junta, {
      where: { id },
      lock: { mode: 'pessimistic_write' },
    })

    if (!junta) {
      throw new NotFoundException(`Junta ${id} not found`)
    }

    return junta
  }

  private async saveGroups(
    manager: EntityManager,
    juntaId: string,
    assignments: readonly GroupAssignment[],
  ): Promise<void> {
    for (const assignment of assignments) {
      const group = await manager.save(
        manager.create(Group, {
          juntaId,
          name: assignment.name || null,
          order: assignment.order,
        }),
      )

      const members = assignment.participantIds.map(participantId =>
        manager.create(ParticipantGroup, { groupId: group.id, participantId }),
      )

      if (members.length > 0) {
        await manager.save(members)
      }
    }
  }

  private async deleteGroups(
    manager: EntityManager,
    juntaId: string,
  ): Promise<void> {
    const groups = await manager.findBy(Group, { juntaId })

    if (groups.length === 0) {
      return
    }

    await manager.delete(ParticipantGroup, {
      groupId: In(groups.map(group => group.id)),
    })
    await manager.delete(Group, { juntaId })
  }
}
