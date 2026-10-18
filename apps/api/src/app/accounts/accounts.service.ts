import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { DataSource, Repository } from 'typeorm'

import { AccountResponse, Role } from '@junta/contracts'

import { Participant } from '@/api/participants/entities/participant.entity'

import { toAccountResponse } from './account.mapper'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
import { Account } from './entities/account.entity'

const BCRYPT_ROUNDS = 10

export const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase()

export interface NewAccount {
  email: string
  password: string
  roles: Role[]
  name: string
  surname: string
  phoneNumber: string
}

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accounts: Repository<Account>,
    private readonly dataSource: DataSource,
  ) {}

  /** BR-11: every account is backed by a new participant, created together. */
  async createAccount(input: NewAccount): Promise<Account> {
    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS)

    const account = await this.dataSource.transaction(async manager => {
      const participant = await manager.save(
        manager.create(Participant, {
          name: input.name,
          surname: input.surname,
          phoneNumber: input.phoneNumber,
        }),
      )

      return manager.save(
        manager.create(Account, {
          email: normalizeEmail(input.email),
          password: passwordHash,
          roles: input.roles,
          participant,
        }),
      )
    })

    return this.findEntity(account.id)
  }

  async create(dto: CreateAccountDto): Promise<AccountResponse> {
    return toAccountResponse(await this.createAccount(dto))
  }

  async findAll(): Promise<AccountResponse[]> {
    const accounts = await this.accounts.find({
      relations: { participant: true },
      order: { email: 'ASC' },
    })

    return accounts.map(toAccountResponse)
  }

  async findOne(id: string): Promise<AccountResponse> {
    return toAccountResponse(await this.findEntity(id))
  }

  /**
   * Writes only the columns the request changes. Saving the loaded entity
   * would also write back its `tokenVersion`, undoing a logout that happened
   * in between (spec 002).
   */
  async update(id: string, dto: UpdateAccountDto): Promise<AccountResponse> {
    const account = await this.findEntity(id)
    const accountChanges: Partial<
      Pick<Account, 'email' | 'roles' | 'password'>
    > = {}
    const participantChanges: Partial<
      Pick<Participant, 'name' | 'surname' | 'phoneNumber'>
    > = {}

    if (dto.email !== undefined)
      accountChanges.email = normalizeEmail(dto.email)
    if (dto.roles !== undefined) accountChanges.roles = dto.roles
    if (dto.password !== undefined) {
      accountChanges.password = await bcrypt.hash(dto.password, BCRYPT_ROUNDS)
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
          { id: account.participant.id },
          participantChanges,
        )
      }
      if (Object.keys(accountChanges).length > 0) {
        await manager.update(Account, { id }, accountChanges)
      }

      // A new password ends every session of this account (spec 002).
      if (dto.password !== undefined) {
        await manager.increment(Account, { id }, 'tokenVersion', 1)
      }
    })

    return toAccountResponse(await this.findEntity(id))
  }

  /**
   * Revokes every refresh token of the account. Matching on the presented
   * version keeps an already revoked token from ending newer sessions.
   */
  async revokeSessions(id: string, tokenVersion: number): Promise<void> {
    await this.accounts.increment({ id, tokenVersion }, 'tokenVersion', 1)
  }

  async remove(id: string): Promise<void> {
    await this.accounts.remove(await this.findEntity(id))
  }

  /** Authentication only: the one query that loads the password hash. */
  findByEmailWithPassword(email: string): Promise<Account | null> {
    return this.accounts
      .createQueryBuilder('account')
      .addSelect('account.password')
      .leftJoinAndSelect('account.participant', 'participant')
      .where('account.email = :email', { email: normalizeEmail(email) })
      .getOne()
  }

  findEntityById(id: string): Promise<Account | null> {
    return this.accounts.findOne({
      where: { id },
      relations: { participant: true },
    })
  }

  private async findEntity(id: string): Promise<Account> {
    const account = await this.findEntityById(id)

    if (!account) {
      throw new NotFoundException(`Account ${id} not found`)
    }

    return account
  }
}
