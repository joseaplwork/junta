import { NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { Permission, Role } from '@junta/contracts'

import { AuthenticatedAccount } from '@/api/common/auth/authenticated-account'
import { Junta } from '@/api/juntas/entities/junta.entity'

import { Participant } from './entities/participant.entity'
import { ParticipantsService } from './participants.service'

const viewer = (roles: Role[]): AuthenticatedAccount => ({
  id: 'account-1',
  email: 'ana@junta.test',
  roles,
  permissions: [Permission.PARTICIPANT_READ],
  participantId: 'participant-self',
})

const buildParticipant = (overrides: Partial<Participant> = {}): Participant =>
  Object.assign(new Participant(), {
    id: 'participant-1',
    name: 'Ana',
    surname: 'Diaz',
    phoneNumber: '600111222',
    ...overrides,
  })

describe('ParticipantsService', () => {
  let service: ParticipantsService
  const query = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getOne: jest.fn(),
  }
  const participants = {
    create: jest.fn((input: Partial<Participant>) => buildParticipant(input)),
    save: jest.fn(async (participant: Participant) => participant),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => query),
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const moduleRef = await Test.createTestingModule({
      providers: [
        ParticipantsService,
        { provide: getRepositoryToken(Participant), useValue: participants },
        { provide: getRepositoryToken(Junta), useValue: {} },
      ],
    }).compile()

    service = moduleRef.get(ParticipantsService)
  })

  it('records who created the participant (BR-16)', async () => {
    await service.create(
      { name: 'Ana', surname: 'Diaz', phoneNumber: '600111222' },
      viewer([Role.ORGANIZER]),
    )

    expect(participants.create).toHaveBeenCalledWith(
      expect.objectContaining({ createdBy: 'account-1' }),
    )
  })

  it('limits an organizer to their own participants (BR-16)', async () => {
    query.getMany.mockResolvedValue([buildParticipant()])

    await service.findAll(viewer([Role.ORGANIZER]))

    expect(query.andWhere).toHaveBeenCalled()
  })

  it('shows an admin every participant', async () => {
    query.getMany.mockResolvedValue([buildParticipant()])

    await expect(service.findAll(viewer([Role.ADMIN]))).resolves.toHaveLength(1)
    expect(query.andWhere).not.toHaveBeenCalled()
  })

  it('answers 404 for a participant outside the scope', async () => {
    query.getOne.mockResolvedValue(null)

    await expect(
      service.findOne(viewer([Role.ORGANIZER]), 'missing'),
    ).rejects.toBeInstanceOf(NotFoundException)
  })

  it('updates only the given fields', async () => {
    const participant = buildParticipant()

    query.getOne.mockResolvedValue(participant)

    await service.update(viewer([Role.ADMIN]), 'participant-1', {
      phoneNumber: '699000000',
    })

    expect(participant).toMatchObject({ name: 'Ana', phoneNumber: '699000000' })
  })
})
