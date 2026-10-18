import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { JuntaResponse, ParticipantResponse } from '@junta/contracts'
import { managesEverything } from '@junta/domain'

import { AuthenticatedAccount } from '@/api/common/auth/authenticated-account'
import { Junta } from '@/api/juntas/entities/junta.entity'
import { toJuntaResponse } from '@/api/juntas/junta.mapper'

import { CreateParticipantDto } from './dto/create-participant.dto'
import { UpdateParticipantDto } from './dto/update-participant.dto'
import { Participant } from './entities/participant.entity'
import { scopeParticipants } from './participant-scope'
import { toParticipantResponse } from './participant.mapper'

/** Organizers only reach their own participants (BR-16); admins reach all. */
@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Participant)
    private readonly participants: Repository<Participant>,
    @InjectRepository(Junta)
    private readonly juntas: Repository<Junta>,
  ) {}

  async create(
    dto: CreateParticipantDto,
    viewer: AuthenticatedAccount,
  ): Promise<ParticipantResponse> {
    const participant = this.participants.create({
      name: dto.name,
      surname: dto.surname,
      phoneNumber: dto.phoneNumber,
      createdBy: viewer.id,
    })

    return toParticipantResponse(await this.participants.save(participant))
  }

  async findAll(viewer: AuthenticatedAccount): Promise<ParticipantResponse[]> {
    const participants = await scopeParticipants(
      this.participants.createQueryBuilder('participant'),
      viewer,
    )
      .orderBy('participant.surname', 'ASC')
      .addOrderBy('participant.name', 'ASC')
      .getMany()

    return participants.map(toParticipantResponse)
  }

  async findOne(
    viewer: AuthenticatedAccount,
    id: string,
  ): Promise<ParticipantResponse> {
    return toParticipantResponse(await this.findEntity(viewer, id))
  }

  async update(
    viewer: AuthenticatedAccount,
    id: string,
    dto: UpdateParticipantDto,
  ): Promise<ParticipantResponse> {
    const participant = await this.findEntity(viewer, id)

    if (dto.name !== undefined) participant.name = dto.name
    if (dto.surname !== undefined) participant.surname = dto.surname
    if (dto.phoneNumber !== undefined) participant.phoneNumber = dto.phoneNumber

    return toParticipantResponse(await this.participants.save(participant))
  }

  async remove(viewer: AuthenticatedAccount, id: string): Promise<void> {
    await this.participants.remove(await this.findEntity(viewer, id))
  }

  /** The participant's juntas; an organizer sees only the ones they run. */
  async findJuntas(
    viewer: AuthenticatedAccount,
    id: string,
  ): Promise<JuntaResponse[]> {
    await this.findEntity(viewer, id)

    const query = this.juntas
      .createQueryBuilder('junta')
      .innerJoin('junta.groups', 'group')
      .innerJoin('group.participantGroups', 'participantGroup')
      .where('participantGroup.participantId = :id', { id })
      .orderBy('junta.startDate', 'DESC')

    if (!managesEverything(viewer)) {
      query.andWhere('junta.organizerId = :viewerId', { viewerId: viewer.id })
    }

    return (await query.getMany()).map(toJuntaResponse)
  }

  private async findEntity(
    viewer: AuthenticatedAccount,
    id: string,
  ): Promise<Participant> {
    const participant = await scopeParticipants(
      this.participants
        .createQueryBuilder('participant')
        .where('participant.id = :id', { id }),
      viewer,
    ).getOne()

    if (!participant) {
      throw new NotFoundException(`Participant ${id} not found`)
    }

    return participant
  }
}
