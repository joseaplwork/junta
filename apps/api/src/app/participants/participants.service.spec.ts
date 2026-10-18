import { NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { Junta } from '@/api/juntas/entities/junta.entity'

import { Participant } from './entities/participant.entity'
import { ParticipantsService } from './participants.service'

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
  const participants = {
    create: jest.fn((input: Partial<Participant>) => buildParticipant(input)),
    save: jest.fn(async (participant: Participant) => participant),
    find: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
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

  it('creates a participant and returns the response contract', async () => {
    await expect(
      service.create({
        name: 'Ana',
        surname: 'Diaz',
        phoneNumber: '600111222',
      }),
    ).resolves.toEqual({
      id: 'participant-1',
      name: 'Ana',
      surname: 'Diaz',
      phoneNumber: '600111222',
    })
  })

  it('lists participants sorted by surname then name', async () => {
    participants.find.mockResolvedValue([buildParticipant()])

    await expect(service.findAll()).resolves.toHaveLength(1)
    expect(participants.find).toHaveBeenCalledWith({
      order: { surname: 'ASC', name: 'ASC' },
    })
  })

  it('throws NotFoundException for an unknown id', async () => {
    participants.findOneBy.mockResolvedValue(null)

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    )
  })

  it('updates only the provided fields', async () => {
    participants.findOneBy.mockResolvedValue(buildParticipant())

    await expect(
      service.update('participant-1', { phoneNumber: '699000000' }),
    ).resolves.toEqual({
      id: 'participant-1',
      name: 'Ana',
      surname: 'Diaz',
      phoneNumber: '699000000',
    })
  })

  it('removes an existing participant', async () => {
    const participant = buildParticipant()

    participants.findOneBy.mockResolvedValue(participant)

    await service.remove('participant-1')

    expect(participants.remove).toHaveBeenCalledWith(participant)
  })
})
