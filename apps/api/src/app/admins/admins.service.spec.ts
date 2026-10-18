import { NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { DataSource } from 'typeorm'

import { Role } from '@junta/contracts'

import { Participant } from '@/api/participants/entities/participant.entity'

import { AdminsService } from './admins.service'
import { Admin } from './entities/admin.entity'

type EntityClass = new () => object

const participant = Object.assign(new Participant(), {
  id: 'participant-1',
  name: 'Ana',
  surname: 'Diaz',
  phoneNumber: '600111222',
})

const buildAdmin = (overrides: Partial<Admin> = {}): Admin =>
  Object.assign(new Admin(), {
    id: 'admin-1',
    email: 'ana@junta.test',
    roles: [Role.ADMIN],
    participant: { ...participant },
    ...overrides,
  })

describe('AdminsService', () => {
  let service: AdminsService
  let savedAdmin: Admin | undefined
  const admins = {
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    increment: jest.fn(),
  }
  const manager = {
    create: jest.fn((entity: EntityClass, input: object) =>
      Object.assign(new entity(), input),
    ),
    save: jest.fn(async (entity: object) => {
      if (entity instanceof Admin) {
        savedAdmin = Object.assign(entity, { id: 'admin-1' })
      }

      return Object.assign(entity, {
        id: (entity as { id?: string }).id ?? 'generated',
      })
    }),
    increment: jest.fn(),
  }
  const dataSource = {
    transaction: jest.fn(async (work: (m: typeof manager) => unknown) =>
      work(manager),
    ),
  }

  beforeEach(async () => {
    jest.clearAllMocks()
    savedAdmin = undefined

    const moduleRef = await Test.createTestingModule({
      providers: [
        AdminsService,
        { provide: getRepositoryToken(Admin), useValue: admins },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile()

    service = moduleRef.get(AdminsService)
  })

  it('creates the participant and the admin with a hashed password (BR-11)', async () => {
    admins.findOne.mockResolvedValue(buildAdmin())

    const response = await service.create({
      email: 'ana@junta.test',
      password: 'plain-secret',
      roles: [Role.ADMIN],
      name: 'Ana',
      surname: 'Diaz',
      phoneNumber: '600111222',
    })

    expect(savedAdmin?.password).not.toBe('plain-secret')
    await expect(
      bcrypt.compare('plain-secret', savedAdmin?.password ?? ''),
    ).resolves.toBe(true)
    expect(response).not.toHaveProperty('password')
    expect(response.participant.name).toBe('Ana')
  })

  it('updates participant fields through the admin', async () => {
    const admin = buildAdmin()

    admins.findOne.mockResolvedValue(admin)

    await service.update('admin-1', { surname: 'Lopez' })

    expect(admin.participant.surname).toBe('Lopez')
    expect(dataSource.transaction).toHaveBeenCalledTimes(1)
  })

  it('ends every session of the admin when the password changes (spec 002)', async () => {
    admins.findOne.mockResolvedValue(buildAdmin())

    await service.update('admin-1', { password: 'new-secret' })

    expect(manager.increment).toHaveBeenCalledWith(
      Admin,
      { id: 'admin-1' },
      'tokenVersion',
      1,
    )
  })

  it('keeps sessions when other fields change', async () => {
    admins.findOne.mockResolvedValue(buildAdmin())

    await service.update('admin-1', { surname: 'Lopez' })

    expect(manager.increment).not.toHaveBeenCalled()
  })

  it('revokes sessions only for the version the token was issued with', async () => {
    await service.revokeSessions('admin-1', 3)

    expect(admins.increment).toHaveBeenCalledWith(
      { id: 'admin-1', tokenVersion: 3 },
      'tokenVersion',
      1,
    )
  })

  it('throws NotFoundException for an unknown id', async () => {
    admins.findOne.mockResolvedValue(null)

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    )
  })
})
