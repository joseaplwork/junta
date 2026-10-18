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

  async update(id: string, dto: UpdateAdminDto): Promise<AdminResponse> {
    const admin = await this.findEntity(id)

    if (dto.email !== undefined) admin.email = dto.email
    if (dto.roles !== undefined) admin.roles = dto.roles
    if (dto.password !== undefined) {
      admin.password = await bcrypt.hash(dto.password, BCRYPT_ROUNDS)
    }
    if (dto.name !== undefined) admin.participant.name = dto.name
    if (dto.surname !== undefined) admin.participant.surname = dto.surname
    if (dto.phoneNumber !== undefined) {
      admin.participant.phoneNumber = dto.phoneNumber
    }

    await this.dataSource.transaction(async manager => {
      await manager.save(admin.participant)
      await manager.save(admin)
    })

    return toAdminResponse(await this.findEntity(id))
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
