import { TestBed } from '@angular/core/testing'
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router'

import { AccessTokenManager } from '@/admin/shared/services/access-token-manager'

import { authGuard } from './auth-guard'

describe('authGuard', () => {
  const tokens = { isExpired: jest.fn(), refresh: jest.fn() }

  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    )

  beforeEach(() => {
    jest.clearAllMocks()
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AccessTokenManager, useValue: tokens },
      ],
    })
  })

  it('lets a valid session in without refreshing', async () => {
    tokens.isExpired.mockReturnValue(false)

    await expect(runGuard()).resolves.toBe(true)
    expect(tokens.refresh).not.toHaveBeenCalled()
  })

  it('refreshes an expired access token, for example after a page reload', async () => {
    tokens.isExpired.mockReturnValue(true)
    tokens.refresh.mockResolvedValue('new-token')

    await expect(runGuard()).resolves.toBe(true)
  })

  it('sends the admin to /login when the refresh fails', async () => {
    tokens.isExpired.mockReturnValue(true)
    tokens.refresh.mockRejectedValue(new Error('expired'))

    const result = (await runGuard()) as UrlTree

    expect(result.toString()).toBe('/login')
  })
})
