import * as bcrypt from 'bcrypt'
import { DataSource } from 'typeorm'

import { Role } from '@junta/contracts'

import { Account } from '@/api/accounts/entities/account.entity'
import { Participant } from '@/api/participants/entities/participant.entity'

/** Same credentials the e2e suite and development seed log in with. */
export const DEV_ADMIN = {
  email: 'admin@junta.com',
  password: 'e2e-password',
} as const

/** Previous development seed email; renamed in place when seeding the new one. */
const LEGACY_ADMIN_EMAIL = 'e2e-admin@junta.test'

export interface SeedAdminInput {
  email: string
  password: string
  name?: string
  surname?: string
  phoneNumber?: string
  /** bcrypt cost. E2e uses 4 for speed; persistent seeds use 10. */
  bcryptRounds?: number
}

/**
 * Creates one admin account (and its participant) if that email is not already
 * present. Renames the legacy `e2e-admin@junta.test` row when present. Shared
 * by e2e boot and the one-shot development seed.
 */
export async function seedAdminAccount(
  dataSource: DataSource,
  input: SeedAdminInput,
): Promise<{ created: boolean; email: string }> {
  const email = input.email.toLowerCase().trim()
  const accounts = dataSource.getRepository(Account)
  const existing = await accounts.findOne({ where: { email } })

  if (existing) {
    return { created: false, email }
  }

  const legacy = await accounts.findOne({
    where: { email: LEGACY_ADMIN_EMAIL },
  })

  if (legacy) {
    legacy.email = email
    await accounts.save(legacy)
    return { created: false, email }
  }

  const participant = await dataSource.getRepository(Participant).save({
    name: input.name ?? 'E2E',
    surname: input.surname ?? 'Admin',
    phoneNumber: input.phoneNumber ?? '000000000',
  })

  await accounts.save({
    email,
    password: await bcrypt.hash(input.password, input.bcryptRounds ?? 10),
    roles: [Role.ADMIN],
    participant,
  })

  return { created: true, email }
}
