import { Permission, Role } from '@junta/contracts'

import { DomainRuleViolation } from './domain-rule-violation'

/**
 * BR-12: the role-to-permission policy. An admin always holds every
 * permission, including permissions added later. Generated resources grant
 * their permissions to organizers.
 */
export const ROLE_PERMISSIONS: Readonly<Record<Role, readonly Permission[]>> = {
  [Role.ADMIN]: Object.values(Permission),
  [Role.ORGANIZER]: [
    Permission.JUNTA_CREATE,
    Permission.JUNTA_READ,
    Permission.JUNTA_UPDATE,
    Permission.JUNTA_DELETE,
    Permission.PARTICIPANT_CREATE,
    Permission.PARTICIPANT_READ,
    Permission.PARTICIPANT_UPDATE,
    Permission.PARTICIPANT_DELETE,
    Permission.SELF_READ,
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

const WEB_APP_ROLES: readonly Role[] = [Role.ADMIN, Role.ORGANIZER]

/** BR-14: only admins and organizers use the web app. */
export function canUseWebApp(roles: readonly Role[]): boolean {
  return roles.some(role => WEB_APP_ROLES.includes(role))
}

export function assertCanUseWebApp(roles: readonly Role[]): void {
  if (!canUseWebApp(roles)) {
    throw new DomainRuleViolation(
      'BR-14',
      'The web app is for admins and organizers. Participants use the mobile app.',
    )
  }
}

/** Who is asking: enough of an account to decide what it may manage. */
export interface Viewer {
  id: string
  roles: readonly Role[]
}

/** BR-16: admins manage everything; organizers only what is theirs. */
export function managesEverything(viewer: Viewer): boolean {
  return viewer.roles.includes(Role.ADMIN)
}

/** BR-16: an organizer manages only the juntas they organize. */
export function canManageJunta(
  viewer: Viewer,
  junta: { organizerId: string },
): boolean {
  return managesEverything(viewer) || junta.organizerId === viewer.id
}
