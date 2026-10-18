import { Permission, Role } from '@junta/contracts'

import { permissionsForRoles } from './permissions'

describe('permissionsForRoles (BR-12)', () => {
  it('grants a super admin every permission', () => {
    expect(permissionsForRoles([Role.SUPER_ADMIN]).sort()).toEqual(
      Object.values(Permission).sort(),
    )
  })

  it('does not let an admin manage other admins', () => {
    expect(permissionsForRoles([Role.ADMIN])).not.toContain(
      Permission.ADMIN_CREATE,
    )
  })

  it('grants an admin every permission except admin management', () => {
    const adminManagement = Object.values(Permission).filter(permission =>
      permission.startsWith('admin:'),
    )

    expect(permissionsForRoles([Role.ADMIN]).sort()).toEqual(
      Object.values(Permission)
        .filter(permission => !adminManagement.includes(permission))
        .sort(),
    )
  })

  it('merges roles without duplicates', () => {
    expect(
      permissionsForRoles([Role.ADMIN, Role.PARTICIPANT]).filter(
        permission => permission === Permission.JUNTA_READ,
      ),
    ).toHaveLength(1)
  })

  it('returns no permissions for no roles', () => {
    expect(permissionsForRoles([])).toEqual([])
  })
})
