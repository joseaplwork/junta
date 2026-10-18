import { ValidatorFn } from '@angular/forms'

import { Role } from '@junta/contracts'

import { TagColor } from '@/admin/shared/components/crud'

export const ASSIGNABLE_ROLES: readonly Role[] = [
  Role.ADMIN,
  Role.ORGANIZER,
  Role.PARTICIPANT,
]

export const ROLE_LABELS: Record<Role, string> = {
  [Role.ADMIN]: 'Admin',
  [Role.ORGANIZER]: 'Organizer',
  [Role.PARTICIPANT]: 'Participant',
}

export const ROLE_TAG_COLORS: Record<Role, TagColor> = {
  [Role.ADMIN]: 'purple',
  [Role.ORGANIZER]: 'green',
  [Role.PARTICIPANT]: 'blue',
}

export function toggleRole(roles: readonly Role[], role: Role): Role[] {
  return roles.includes(role)
    ? roles.filter(current => current !== role)
    : [...roles, role]
}

/** Every account holds at least one role. Participant-only accounts use the mobile app (BR-14). */
export const atLeastOneRole: ValidatorFn = control =>
  (control.value as Role[]).length > 0 ? null : { noRole: true }
