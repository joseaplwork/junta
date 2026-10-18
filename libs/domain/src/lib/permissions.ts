import { Permission, Role } from '@junta/contracts'

import { DomainRuleViolation } from './domain-rule-violation'

/**
 * BR-12: the role-to-permission policy. A super admin always holds every
 * permission, including permissions added later.
 */
export const ROLE_PERMISSIONS: Readonly<Record<Role, readonly Permission[]>> = {
  [Role.SUPER_ADMIN]: Object.values(Permission),
  [Role.ADMIN]: [
    Permission.JUNTA_CREATE,
    Permission.JUNTA_READ,
    Permission.JUNTA_UPDATE,
    Permission.JUNTA_DELETE,
    Permission.PARTICIPANT_CREATE,
    Permission.PARTICIPANT_READ,
    Permission.PARTICIPANT_UPDATE,
    Permission.PARTICIPANT_DELETE,
  ],
  [Role.PARTICIPANT]: [Permission.SELF_READ],
}

export function permissionsForRoles(roles: readonly Role[]): Permission[] {
  const permissions = new Set<Permission>()

  for (const role of roles) {
    for (const permission of ROLE_PERMISSIONS[role] ?? []) {
      permissions.add(permission)
    }
  }

  return [...permissions]
}

const BACK_OFFICE_ROLES: readonly Role[] = [Role.SUPER_ADMIN, Role.ADMIN]

/** BR-14: an admin account holds at least one back-office role. */
export function hasBackOfficeRole(roles: readonly Role[]): boolean {
  return roles.some(role => BACK_OFFICE_ROLES.includes(role))
}

export function assertBackOfficeRole(roles: readonly Role[]): void {
  if (!hasBackOfficeRole(roles)) {
    throw new DomainRuleViolation(
      'BR-14',
      'An admin account needs the admin or super admin role. The participant role cannot be its only role.',
    )
  }
}
