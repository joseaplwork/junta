import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Junta } from '@/api/juntas/junta.entity'

import { Participant } from './participant.entity'
import {
  ParticipantPayload,
  ParticipantUpdatePayload,
} from './participant.interface'

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(Participant)
    private readonly _participantsRepository: Repository<Participant>,
    @InjectRepository(Junta)
    private readonly _juntasRepository: Repository<Junta>,
  ) {}

  createOne({
    name,
    surname,
    phoneNumber,
  }: ParticipantPayload): Promise<Participant> {
    const participant = this._participantsRepository.create({
      name,
      surname,
      phone_number: phoneNumber,
    })

    return this._participantsRepository.save(participant)
  }

  findOneById(id: string): Promise<Participant | null> {
    return this._participantsRepository.findOne({ where: { id } })
  }

  findAll(): Promise<Participant[]> {
    return this._participantsRepository.find()
  }

  async update(
    id: string,
    data: ParticipantUpdatePayload,
  ): Promise<Participant> {
    const participant = await this.findOneById(id)
    if (!participant) throw new NotFoundException('Participant not found')

    if (data.name !== undefined) participant.name = data.name
    if (data.surname !== undefined) participant.surname = data.surname
    if (data.phoneNumber !== undefined)
      participant.phone_number = data.phoneNumber

    return this._participantsRepository.save(participant)
  }

  async remove(id: string): Promise<void> {
    const participant = await this.findOneById(id)
    if (!participant) throw new NotFoundException('Participant not found')
    await this._participantsRepository.remove(participant)
  }

  save(participant: Participant): Promise<Participant> {
    return this._participantsRepository.save(participant)
  }

  async findJuntasByParticipantId(participantId: string): Promise<Junta[]> {
    const participant = await this.findOneById(participantId)
    if (!participant) {
      throw new NotFoundException('Participant not found')
    }

    const juntas = await this._juntasRepository
      .createQueryBuilder('junta')
      .innerJoin('junta.slotList', 'slot')
      .innerJoin('slot.participantsSlots', 'participantsSlots')
      .where('participantsSlots.participant_id = :participantId', {
        participantId,
      })
      .getMany()

    return juntas
  }
}
