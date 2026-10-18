import { Permission, Role } from '@junta/contracts'

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
  [Role.PARTICIPANT]: [Permission.JUNTA_READ, Permission.PARTICIPANT_READ],
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
