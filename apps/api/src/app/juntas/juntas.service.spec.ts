import { NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import { Role } from '@junta/contracts'
import { DomainRuleViolation } from '@junta/domain'

import { AuthenticatedAccount } from '@/api/common/auth/authenticated-account'

import { CreateJuntaDto } from './dto/create-junta.dto'
import { Group } from './entities/group.entity'
import { Junta } from './entities/junta.entity'
import { ParticipantGroup } from './entities/participant-group.entity'
import { JuntasService } from './juntas.service'

type EntityClass = new () => object

const viewer = (id: string, roles: Role[]): AuthenticatedAccount => ({
  id,
  email: `${id}@junta.test`,
  roles,
  permissions: [],
})
const admin = viewer('admin-1', [Role.ADMIN])
const otherOrganizer = viewer('organizer-2', [Role.ORGANIZER])

const buildJunta = (overrides: Partial<Junta> = {}): Junta =>
  Object.assign(new Junta(), {
    id: 'junta-1',
    name: 'Main Junta',
    amount: 2000,
    currency: 'MXN',
    groupCount: 2,
    groupAmount: 1000,
    startDate: '2027-01-15',
    endDate: '2027-02-15',
    organizerId: 'admin-1',
    ...overrides,
  })

const createDto = (overrides: Partial<CreateJuntaDto> = {}): CreateJuntaDto =>
  Object.assign(new CreateJuntaDto(), {
    name: 'Main Junta',
    amount: 2000,
    currency: 'MXN',
    startDate: '2027-01-15',
    endDate: '2027-02-15',
    groups: [
      { order: 1, participantIds: ['p1'] },
      { order: 2, participantIds: ['p2', 'p3'] },
    ],
    ...overrides,
  })

describe('JuntasService', () => {
  let service: JuntasService
  let saved: object[]
  const juntas = { find: jest.fn(), findOne: jest.fn() }
  const manager = {
    create: jest.fn((entity: EntityClass, input: object) =>
      Object.assign(new entity(), input),
    ),
    save: jest.fn(async (value: object | object[]) => {
      const entities = Array.isArray(value) ? value : [value]

      entities.forEach((entity, index) => {
        Object.assign(entity, {
          id: (entity as { id?: string }).id ?? `id-${saved.length + index}`,
        })
      })
      saved.push(...entities)

      return value
    }),
    findOne: jest.fn(),
    findBy: jest.fn(),
    delete: jest.fn(),
  }
  const dataSource = {
    transaction: jest.fn(async (work: (m: typeof manager) => unknown) =>
      work(manager),
    ),
  }

  beforeEach(async () => {
    jest.clearAllMocks()
    saved = []

    const moduleRef = await Test.createTestingModule({
      providers: [
        JuntasService,
        { provide: getRepositoryToken(Junta), useValue: juntas },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile()

    service = moduleRef.get(JuntasService)
  })

  describe('create', () => {
    it('stores the junta, one group per assignment and every membership', async () => {
      const response = await service.create(createDto(), admin)

      expect(response).toMatchObject({
        name: 'Main Junta',
        groupCount: 2,
        groupAmount: 1000,
        startDate: '2027-01-15',
        organizerId: 'admin-1',
      })
      expect(saved.filter(entity => entity instanceof Group)).toHaveLength(2)
      expect(
        saved.filter(entity => entity instanceof ParticipantGroup),
      ).toHaveLength(3)
    })

    it('rejects a participant assigned to two groups (BR-05) before writing', async () => {
      const dto = createDto({
        groups: [
          { order: 1, participantIds: ['p1'] },
          { order: 2, participantIds: ['p1'] },
        ],
      })

      await expect(service.create(dto, admin)).rejects.toBeInstanceOf(
        DomainRuleViolation,
      )
      expect(dataSource.transaction).not.toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('returns groups sorted by payout order with their members', async () => {
      juntas.findOne.mockResolvedValue(
        buildJunta({
          groups: [
            Object.assign(new Group(), {
              id: 'g2',
              name: null,
              order: 2,
              participantGroups: [],
            }),
            Object.assign(new Group(), {
              id: 'g1',
              name: 'First',
              order: 1,
              participantGroups: [
                {
                  participant: { id: 'p1', name: 'Ana', surname: 'Diaz' },
                },
              ],
            }),
          ],
        }),
      )

      const response = await service.findOne(admin, 'junta-1')

      expect(response.groups.map(group => group.order)).toEqual([1, 2])
      expect(response.groups[0].members).toEqual([
        { id: 'p1', name: 'Ana', surname: 'Diaz' },
      ])
    })

    it('throws NotFoundException for an unknown id', async () => {
      juntas.findOne.mockResolvedValue(null)

      await expect(service.findOne(admin, 'missing')).rejects.toBeInstanceOf(
        NotFoundException,
      )
    })
  })

  describe('update', () => {
    it('replaces the groups and recomputes the group amount', async () => {
      manager.findOne.mockResolvedValue(buildJunta())
      manager.findBy.mockResolvedValue([{ id: 'old-group' }])

      const response = await service.update(admin, 'junta-1', {
        amount: 3000,
        endDate: '2027-03-15',
        groups: [
          { order: 1, participantIds: ['p1'] },
          { order: 2, participantIds: ['p2'] },
          { order: 3, participantIds: ['p3'] },
        ],
      })

      expect(response).toMatchObject({ groupCount: 3, groupAmount: 1000 })
      expect(manager.delete).toHaveBeenCalledWith(Group, { juntaId: 'junta-1' })
      expect(saved.filter(entity => entity instanceof Group)).toHaveLength(3)
    })

    it('rejects a pool that does not split evenly across the groups (BR-03)', async () => {
      manager.findOne.mockResolvedValue(
        buildJunta({ endDate: '2027-03-15', groupCount: 3 }),
      )

      await expect(
        service.update(admin, 'junta-1', {
          amount: 2000,
          groups: [
            { order: 1, participantIds: ['p1'] },
            { order: 2, participantIds: ['p2'] },
            { order: 3, participantIds: ['p3'] },
          ],
        }),
      ).rejects.toMatchObject({ rule: 'BR-03' })
    })

    it('changes the currency (BR-13)', async () => {
      manager.findOne.mockResolvedValue(buildJunta())

      await expect(
        service.update(admin, 'junta-1', { currency: 'PEN' }),
      ).resolves.toMatchObject({ currency: 'PEN' })
    })

    it('refuses an organizer change once the junta has started (BR-17)', async () => {
      manager.findOne.mockResolvedValue(
        buildJunta({ startDate: '2020-01-15', endDate: '2020-02-15' }),
      )

      await expect(
        service.update(viewer('admin-1', [Role.ORGANIZER]), 'junta-1', {
          name: 'Later',
        }),
      ).rejects.toMatchObject({ rule: 'BR-17' })
    })

    it('locks the junta row inside the transaction', async () => {
      manager.findOne.mockResolvedValue(buildJunta())

      await service.update(admin, 'junta-1', { name: 'Renamed' })

      expect(manager.findOne).toHaveBeenCalledWith(Junta, {
        where: { id: 'junta-1' },
        lock: { mode: 'pessimistic_write' },
      })
    })

    it('throws NotFoundException for an unknown id', async () => {
      manager.findOne.mockResolvedValue(null)

      await expect(
        service.update(admin, 'missing', { name: 'Renamed' }),
      ).rejects.toBeInstanceOf(NotFoundException)
    })
  })

  describe('remove', () => {
    it('refuses an organizer delete once the junta has started (BR-17)', async () => {
      manager.findOne.mockResolvedValue(
        buildJunta({ startDate: '2020-01-15', endDate: '2020-02-15' }),
      )

      await expect(
        service.remove(viewer('admin-1', [Role.ORGANIZER]), 'junta-1'),
      ).rejects.toMatchObject({ rule: 'BR-17' })
      expect(manager.delete).not.toHaveBeenCalled()
    })

    it('deletes memberships, groups and the junta in one transaction', async () => {
      manager.findOne.mockResolvedValue(buildJunta())
      manager.findBy.mockResolvedValue([{ id: 'g1' }])

      await service.remove(admin, 'junta-1')

      expect(dataSource.transaction).toHaveBeenCalledTimes(1)
      expect(manager.delete).toHaveBeenLastCalledWith(Junta, { id: 'junta-1' })
    })
  })

  describe("another organizer's junta (BR-16)", () => {
    it('answers 404 to reads and edits', async () => {
      juntas.findOne.mockResolvedValue(buildJunta())
      manager.findOne.mockResolvedValue(buildJunta())

      await expect(
        service.findOne(otherOrganizer, 'junta-1'),
      ).rejects.toBeInstanceOf(NotFoundException)
      await expect(
        service.update(otherOrganizer, 'junta-1', { name: 'Taken' }),
      ).rejects.toBeInstanceOf(NotFoundException)
    })
  })
})
