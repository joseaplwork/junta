import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { render, screen } from '@testing-library/angular'

import { Permission } from '@junta/contracts'

import { AdminProfile } from '@/admin/shared/services/admin-profile'

import { HasPermission } from './has-permission'

@Component({
  imports: [HasPermission],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span *jaHasPermission="permission()">guarded</span>
    <span *jaHasPermission="null">public</span>
  `,
})
class Host {
  readonly permission = signal<Permission | null>(Permission.ADMIN_READ)
}

async function setup(initiallyGranted: Permission[]) {
  const granted = signal(initiallyGranted)
  const rendered = await render(Host, {
    providers: [
      {
        provide: AdminProfile,
        useValue: {
          hasPermission: (permission: Permission) =>
            granted().includes(permission),
        },
      },
    ],
  })

  return { ...rendered, granted }
}

describe('HasPermission', () => {
  it('renders the element when the admin holds the permission', async () => {
    await setup([Permission.ADMIN_READ])

    expect(screen.getByText('guarded')).toBeInTheDocument()
  })

  it('removes the element when the admin lacks the permission', async () => {
    await setup([])

    expect(screen.queryByText('guarded')).toBeNull()
  })

  it('always renders when no permission is required', async () => {
    await setup([])

    expect(screen.getByText('public')).toBeInTheDocument()
  })

  it('reacts when the required permission changes', async () => {
    const { fixture } = await setup([Permission.JUNTA_READ])

    expect(screen.queryByText('guarded')).toBeNull()

    fixture.componentInstance.permission.set(Permission.JUNTA_READ)
    await fixture.whenStable()

    expect(screen.getByText('guarded')).toBeInTheDocument()
  })

  it('keeps the same element when a token refresh brings the same permissions', async () => {
    const { fixture, granted } = await setup([Permission.ADMIN_READ])
    const before = screen.getByText('guarded')

    granted.set([Permission.ADMIN_READ])
    await fixture.whenStable()

    expect(screen.getByText('guarded')).toBe(before)
  })
})
