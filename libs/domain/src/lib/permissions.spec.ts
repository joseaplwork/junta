import { Permission, Role } from '@junta/contracts'

import {
  assertCanUseWebApp,
  canManageJunta,
  canUseWebApp,
  managesEverything,
  permissionsForRoles,
} from './permissions'

describe('permissionsForRoles (BR-12)', () => {
  it('grants an admin every permission', () => {
    expect(permissionsForRoles([Role.ADMIN]).sort()).toEqual(
      Object.values(Permission).sort(),
    )
  })

  it('grants an organizer everything except account management', () => {
    expect(permissionsForRoles([Role.ORGANIZER]).sort()).toEqual(
      Object.values(Permission)
        .filter(permission => !permission.startsWith('account:'))
        .sort(),
    )
  })

  it('limits a participant to their own data (BR-15)', () => {
    expect(permissionsForRoles([Role.PARTICIPANT])).toEqual([
      Permission.SELF_READ,
    ])
  })

  it('merges roles without duplicates', () => {
    expect(
      permissionsForRoles([Role.ORGANIZER, Role.PARTICIPANT]).filter(
        permission => permission === Permission.SELF_READ,
      ),
    ).toHaveLength(1)
  })

  it('returns no permissions for no roles', () => {
    expect(permissionsForRoles([])).toEqual([])
  })
})

describe('canUseWebApp (BR-14)', () => {
  it.each([[[Role.ADMIN]], [[Role.ORGANIZER, Role.PARTICIPANT]]])(
    'accepts %j',
    roles => {
      expect(canUseWebApp(roles)).toBe(true)
      expect(() => assertCanUseWebApp(roles)).not.toThrow()
    },
  )

  it.each([[[Role.PARTICIPANT]], [[]]])('refuses %j', roles => {
    expect(canUseWebApp(roles)).toBe(false)
    expect(() => assertCanUseWebApp(roles)).toThrow('mobile app')
  })
})

describe('canManageJunta (BR-16)', () => {
  const admin = { id: 'a', roles: [Role.ADMIN] }
  const organizer = { id: 'o', roles: [Role.ORGANIZER] }

  it('lets admins manage every junta', () => {
    expect(managesEverything(admin)).toBe(true)
    expect(canManageJunta(admin, { organizerId: 'someone' })).toBe(true)
  })

  it('lets an organizer manage only their own juntas', () => {
    expect(managesEverything(organizer)).toBe(false)
    expect(canManageJunta(organizer, { organizerId: 'o' })).toBe(true)
    expect(canManageJunta(organizer, { organizerId: 'other' })).toBe(false)
  })
})
