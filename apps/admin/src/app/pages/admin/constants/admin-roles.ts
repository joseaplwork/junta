import { ValidatorFn } from '@angular/forms'

import { Role } from '@junta/contracts'
import { hasBackOfficeRole } from '@junta/domain'

import { TagColor } from '@/admin/shared/components/crud'

export const ASSIGNABLE_ROLES: readonly Role[] = [
  Role.SUPER_ADMIN,
  Role.ADMIN,
  Role.PARTICIPANT,
]

export const ROLE_LABELS: Record<Role, string> = {
  [Role.SUPER_ADMIN]: 'Super Admin',
  [Role.ADMIN]: 'Admin',
  [Role.PARTICIPANT]: 'Participant',
}

export const ROLE_TAG_COLORS: Record<Role, TagColor> = {
  [Role.SUPER_ADMIN]: 'purple',
  [Role.ADMIN]: 'green',
  [Role.PARTICIPANT]: 'blue',
}

export function toggleRole(roles: readonly Role[], role: Role): Role[] {
  return roles.includes(role)
    ? roles.filter(current => current !== role)
    : [...roles, role]
}

/** BR-14: the participant role cannot be an admin account's only role. */
export const backOfficeRoleValidator: ValidatorFn = control =>
  hasBackOfficeRole(control.value as Role[]) ? null : { backOfficeRole: true }
