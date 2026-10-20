import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, EntityManager, In, Repository } from 'typeorm'

import {
  GroupAssignment,
  JuntaDetailResponse,
  JuntaResponse,
} from '@junta/contracts'
import {
  assertJuntaDeletable,
  assertJuntaWrite,
  calculateGroupAmount,
  canManageJunta,
  managesEverything,
  utcToday,
} from '@junta/domain'

import { AuthenticatedAccount } from '@/api/common/auth/authenticated-account'
import { assertParticipantsVisible } from '@/api/participants/participant-scope'

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

  /** The creator becomes the organizer (BR-16). */
  async create(
    dto: CreateJuntaDto,
    viewer: AuthenticatedAccount,
  ): Promise<JuntaResponse> {
    assertJuntaWrite(
      {
        startDate: dto.startDate,
        endDate: dto.endDate,
        poolAmount: dto.amount,
        groupCount: dto.groups.length,
        groups: dto.groups,
      },
      { roles: viewer.roles, today: utcToday(), operation: 'create' },
    )

    const junta = await this.dataSource.transaction(async manager => {
      await assertParticipantsVisible(manager, viewer, memberIds(dto.groups))

      const saved = await manager.save(
        manager.create(Junta, {
          name: dto.name,
          amount: dto.amount,
          currency: dto.currency,
          groupCount: dto.groups.length,
          groupAmount: calculateGroupAmount(dto.amount, dto.groups.length),
          startDate: dto.startDate,
          endDate: dto.endDate,
          organizerId: viewer.id,
        }),
      )

      await this.saveGroups(manager, saved.id, dto.groups)

      return saved
    })

    return toJuntaResponse(junta)
  }

  async findAll(viewer: AuthenticatedAccount): Promise<JuntaResponse[]> {
    const juntas = await this.juntas.find({
      where: managesEverything(viewer) ? {} : { organizerId: viewer.id },
      order: { startDate: 'DESC' },
    })

    return juntas.map(toJuntaResponse)
  }

  async findOne(
    viewer: AuthenticatedAccount,
    id: string,
  ): Promise<JuntaDetailResponse> {
    const junta = await this.juntas.findOne({
      where: { id },
      relations: { groups: { participantGroups: { participant: true } } },
    })

    if (!junta || !canManageJunta(viewer, junta)) {
      throw new NotFoundException(`Junta ${id} not found`)
    }

    return toJuntaDetailResponse(junta)
  }

  async update(
    viewer: AuthenticatedAccount,
    id: string,
    dto: UpdateJuntaDto,
  ): Promise<JuntaResponse> {
    const saved = await this.dataSource.transaction(async manager => {
      const junta = await this.lockEntity(manager, viewer, id)
      const groups = dto.groups

      assertJuntaWrite(
        {
          startDate: dto.startDate ?? junta.startDate,
          endDate: dto.endDate ?? junta.endDate,
          poolAmount: dto.amount ?? junta.amount,
          groupCount: groups ? groups.length : junta.groupCount,
          groups,
        },
        {
          roles: viewer.roles,
          today: utcToday(),
          operation: 'update',
          storedStartDate: junta.startDate,
        },
      )

      if (groups) {
        await assertParticipantsVisible(manager, viewer, memberIds(groups))
      }
      if (dto.name !== undefined) junta.name = dto.name
      if (dto.currency !== undefined) junta.currency = dto.currency
      if (dto.amount !== undefined) junta.amount = dto.amount
      if (dto.startDate !== undefined) junta.startDate = dto.startDate
      if (dto.endDate !== undefined) junta.endDate = dto.endDate
      if (groups) {
        junta.groupCount = groups.length
        await this.deleteGroups(manager, id)
        await this.saveGroups(manager, id, groups)
      }
      junta.groupAmount = calculateGroupAmount(junta.amount, junta.groupCount)

      return manager.save(junta)
    })

    return toJuntaResponse(saved)
  }

  async remove(viewer: AuthenticatedAccount, id: string): Promise<void> {
    await this.dataSource.transaction(async manager => {
      const junta = await this.lockEntity(manager, viewer, id)

      assertJuntaDeletable({
        roles: viewer.roles,
        today: utcToday(),
        storedStartDate: junta.startDate,
      })
      await this.deleteGroups(manager, id)
      await manager.delete(Junta, { id })
    })
  }

  /**
   * Loads the junta with a row lock, so concurrent edits of one junta run one
   * after another. Someone else's junta answers 404 (BR-16).
   */
  private async lockEntity(
    manager: EntityManager,
    viewer: AuthenticatedAccount,
    id: string,
  ): Promise<Junta> {
    const junta = await manager.findOne(Junta, {
      where: { id },
      lock: { mode: 'pessimistic_write' },
    })

    if (!junta || !canManageJunta(viewer, junta)) {
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

const memberIds = (groups: readonly GroupAssignment[]): string[] =>
  groups.flatMap(group => group.participantIds)
