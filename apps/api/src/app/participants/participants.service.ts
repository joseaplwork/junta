import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { JuntaResponse, ParticipantResponse } from '@junta/contracts'

import { Junta } from '@/api/juntas/entities/junta.entity'
import { toJuntaResponse } from '@/api/juntas/junta.mapper'

import { CreateParticipantDto } from './dto/create-participant.dto'
import { UpdateParticipantDto } from './dto/update-participant.dto'
import { Participant } from './entities/participant.entity'
import { toParticipantResponse } from './participant.mapper'

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Participant)
    private readonly participants: Repository<Participant>,
    @InjectRepository(Junta)
    private readonly juntas: Repository<Junta>,
  ) {}

  async create(dto: CreateParticipantDto): Promise<ParticipantResponse> {
    const participant = this.participants.create({
      name: dto.name,
      surname: dto.surname,
      phoneNumber: dto.phoneNumber,
    })

    return toParticipantResponse(await this.participants.save(participant))
  }

  async findAll(): Promise<ParticipantResponse[]> {
    const participants = await this.participants.find({
      order: { surname: 'ASC', name: 'ASC' },
    })

    return participants.map(toParticipantResponse)
  }

  async findOne(id: string): Promise<ParticipantResponse> {
    return toParticipantResponse(await this.findEntity(id))
  }

  async update(
    id: string,
    dto: UpdateParticipantDto,
  ): Promise<ParticipantResponse> {
    const participant = await this.findEntity(id)

    if (dto.name !== undefined) participant.name = dto.name
    if (dto.surname !== undefined) participant.surname = dto.surname
    if (dto.phoneNumber !== undefined) participant.phoneNumber = dto.phoneNumber

    return toParticipantResponse(await this.participants.save(participant))
  }

  async remove(id: string): Promise<void> {
    await this.participants.remove(await this.findEntity(id))
  }

  async findJuntas(id: string): Promise<JuntaResponse[]> {
    await this.findEntity(id)

    const juntas = await this.juntas
      .createQueryBuilder('junta')
      .innerJoin('junta.groups', 'group')
      .innerJoin('group.participantGroups', 'participantGroup')
      .where('participantGroup.participantId = :id', { id })
      .orderBy('junta.startDate', 'DESC')
      .getMany()

    return juntas.map(toJuntaResponse)
  }

  private async findEntity(id: string): Promise<Participant> {
    const participant = await this.participants.findOneBy({ id })

    if (!participant) {
      throw new NotFoundException(`Participant ${id} not found`)
    }

    return participant
  }
}
