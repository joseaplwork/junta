import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { DataSource, Repository } from 'typeorm'

import { AdminResponse } from '@junta/contracts'

import { Participant } from '@/api/participants/entities/participant.entity'

import { toAdminResponse } from './admin.mapper'
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminDto } from './dto/update-admin.dto'
import { Admin } from './entities/admin.entity'

const BCRYPT_ROUNDS = 10

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly admins: Repository<Admin>,
    private readonly dataSource: DataSource,
  ) {}

  /** BR-11: every admin is backed by a participant, created in the same transaction. */
  async create(dto: CreateAdminDto): Promise<AdminResponse> {
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS)

    const admin = await this.dataSource.transaction(async manager => {
      const participant = await manager.save(
        manager.create(Participant, {
          name: dto.name,
          surname: dto.surname,
          phoneNumber: dto.phoneNumber,
        }),
      )

      return manager.save(
        manager.create(Admin, {
          email: dto.email,
          password: passwordHash,
          roles: dto.roles,
          participant,
        }),
      )
    })

    return toAdminResponse(await this.findEntity(admin.id))
  }

  async findAll(): Promise<AdminResponse[]> {
    const admins = await this.admins.find({
      relations: { participant: true },
      order: { email: 'ASC' },
    })

    return admins.map(toAdminResponse)
  }

  async findOne(id: string): Promise<AdminResponse> {
    return toAdminResponse(await this.findEntity(id))
  }

  /**
   * Writes only the columns the request changes. Saving the loaded entity
   * would also write back its `tokenVersion`, undoing a logout that happened
   * in between (spec 002).
   */
  async update(id: string, dto: UpdateAdminDto): Promise<AdminResponse> {
    const admin = await this.findEntity(id)
    const adminChanges: Partial<Pick<Admin, 'email' | 'roles' | 'password'>> =
      {}
    const participantChanges: Partial<
      Pick<Participant, 'name' | 'surname' | 'phoneNumber'>
    > = {}

    if (dto.email !== undefined) adminChanges.email = dto.email
    if (dto.roles !== undefined) adminChanges.roles = dto.roles
    if (dto.password !== undefined) {
      adminChanges.password = await bcrypt.hash(dto.password, BCRYPT_ROUNDS)
    }
    if (dto.name !== undefined) participantChanges.name = dto.name
    if (dto.surname !== undefined) participantChanges.surname = dto.surname
    if (dto.phoneNumber !== undefined) {
      participantChanges.phoneNumber = dto.phoneNumber
    }

    await this.dataSource.transaction(async manager => {
      if (Object.keys(participantChanges).length > 0) {
        await manager.update(
          Participant,
          { id: admin.participant.id },
          participantChanges,
        )
      }
      if (Object.keys(adminChanges).length > 0) {
        await manager.update(Admin, { id }, adminChanges)
      }

      // A new password ends every session of this admin (spec 002).
      if (dto.password !== undefined) {
        await manager.increment(Admin, { id }, 'tokenVersion', 1)
      }
    })

    return toAdminResponse(await this.findEntity(id))
  }

  /**
   * Revokes every refresh token of the admin. Matching on the presented
   * version keeps an already revoked token from ending newer sessions.
   */
  async revokeSessions(id: string, tokenVersion: number): Promise<void> {
    await this.admins.increment({ id, tokenVersion }, 'tokenVersion', 1)
  }

  async remove(id: string): Promise<void> {
    await this.admins.remove(await this.findEntity(id))
  }

  /** Authentication only: the one query that loads the password hash. */
  findByEmailWithPassword(email: string): Promise<Admin | null> {
    return this.admins
      .createQueryBuilder('admin')
      .addSelect('admin.password')
      .where('admin.email = :email', { email })
      .getOne()
  }

  findEntityById(id: string): Promise<Admin | null> {
    return this.admins.findOneBy({ id })
  }

  private async findEntity(id: string): Promise<Admin> {
    const admin = await this.admins.findOne({
      where: { id },
      relations: { participant: true },
    })

    if (!admin) {
      throw new NotFoundException(`Admin ${id} not found`)
    }

    return admin
  }
}
