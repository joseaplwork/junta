import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Group } from '@/api/groups/group.entity'
import { ParticipantsGroups } from '@/api/participants-groups/participants-groups.entity'

import { Junta } from './junta.entity'
import { JuntaPayload, JuntaUpdatePayload } from './junta.interface'

@Injectable()
export class JuntaService {
  constructor(
    @InjectRepository(Junta)
    private readonly _juntasRepository: Repository<Junta>,
    @InjectRepository(Group)
    private readonly _groupsRepository: Repository<Group>,
    @InjectRepository(ParticipantsGroups)
    private readonly _participantsGroupsRepository: Repository<ParticipantsGroups>,
  ) {}

  async createOne(
    { name, amount, startDate, endDate, active, groupConfigs }: JuntaPayload,
    adminId: string,
  ): Promise<Junta> {
    const groups = groupConfigs.length
    const partialAmount = Math.floor(amount / groups)

    const junta = this._juntasRepository.create({
      name,
      amount,
      groups,
      partial_amount: partialAmount,
      start_date: new Date(startDate),
      end_date: new Date(endDate),
      active: active,
      admin_id: adminId,
    })

    const savedJunta = await this._juntasRepository.save(junta)

    for (const groupConfig of groupConfigs) {
      const group = this._groupsRepository.create({
        name: groupConfig.name || null,
        order: groupConfig.order,
        junta_id: savedJunta.id,
      })

      const savedGroup = await this._groupsRepository.save(group)

      for (const participantId of groupConfig.participantIds) {
        const participantsGroup = this._participantsGroupsRepository.create({
          participant_id: participantId,
          group_id: savedGroup.id,
        })

        await this._participantsGroupsRepository.save(participantsGroup)
      }
    }

    return savedJunta
  }

  async findOneById(id: string): Promise<Junta | null> {
    return this._juntasRepository.findOne({
      where: { id },
      relations: [
        'groupList',
        'groupList.participantsGroups',
        'groupList.participantsGroups.participant',
      ],
    })
  }

  findAll(): Promise<Junta[]> {
    return this._juntasRepository.find()
  }

  findByAdminId(adminId: string): Promise<Junta[]> {
    return this._juntasRepository.find({ where: { admin_id: adminId } })
  }

  async update(id: string, data: JuntaUpdatePayload): Promise<Junta> {
    const junta = await this._juntasRepository.findOne({ where: { id } })
    if (!junta) throw new NotFoundException('Junta not found')

    if (data.name !== undefined) junta.name = data.name
    if (data.amount !== undefined) junta.amount = data.amount
    if (data.startDate !== undefined)
      junta.start_date = new Date(data.startDate)
    if (data.endDate !== undefined) junta.end_date = new Date(data.endDate)
    if (data.active !== undefined) junta.active = data.active

    if (data.groupConfigs) {
      const existingGroups = await this._groupsRepository.find({
        where: { junta_id: id },
      })

      for (const existingGroup of existingGroups) {
        await this._participantsGroupsRepository.delete({
          group_id: existingGroup.id,
        })
        await this._groupsRepository.remove(existingGroup)
      }

      for (const groupConfig of data.groupConfigs) {
        const group = this._groupsRepository.create({
          name: groupConfig.name || null,
          order: groupConfig.order,
          junta_id: id,
        })

        const savedGroup = await this._groupsRepository.save(group)

        for (const participantId of groupConfig.participantIds) {
          const participantsGroup = this._participantsGroupsRepository.create({
            participant_id: participantId,
            group_id: savedGroup.id,
          })

          await this._participantsGroupsRepository.save(participantsGroup)
        }
      }

      junta.groups = data.groupConfigs.length
    }

    if (data.amount !== undefined || data.groupConfigs) {
      junta.partial_amount = Math.floor(junta.amount / junta.groups)
    }

    return this._juntasRepository.save(junta)
  }

  async remove(id: string): Promise<void> {
    const junta = await this.findOneById(id)
    if (!junta) throw new NotFoundException('Junta not found')
    await this._juntasRepository.remove(junta)
  }
}
