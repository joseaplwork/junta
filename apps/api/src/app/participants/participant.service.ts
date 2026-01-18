import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

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
}
