import { TestBed } from '@angular/core/testing'

import { AuthApi } from '@/admin/shared/api/auth-api'

import { AccessTokenManager } from './access-token-manager'
import { AdminSession } from './admin-session'
import { Navigation } from './navigation'

describe('AdminSession', () => {
  let session: AdminSession
  let finishRefresh: () => void
  const calls: string[] = []
  const authApi = {
    login: jest.fn().mockResolvedValue({ accessToken: 'token' }),
    logout: jest.fn(async () => {
      calls.push('api logout')
    }),
  }
  const tokens = {
    start: jest.fn(),
    clear: jest.fn(() => calls.push('local session cleared')),
    settled: jest.fn(
      () =>
        new Promise<void>(resolve => {
          finishRefresh = () => {
            calls.push('refresh settled')
            resolve()
          }
        }),
    ),
  }
  const navigation = {
    goToDashboardPage: jest.fn(),
    goToLoginPage: jest.fn(),
  }

  beforeEach(() => {
    calls.length = 0
    jest.clearAllMocks()

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthApi, useValue: authApi },
        { provide: AccessTokenManager, useValue: tokens },
        { provide: Navigation, useValue: navigation },
      ],
    })

    session = TestBed.inject(AdminSession)
  })

  it('starts a new token session on login', async () => {
    await session.login({ email: 'ana@junta.test', password: 'secret' })

    expect(tokens.start).toHaveBeenCalledWith('token')
    expect(navigation.goToDashboardPage).toHaveBeenCalled()
  })

  it('logs out locally at once and clears the cookie after any refresh in flight', async () => {
    const logout = session.logout()

    expect(calls).toEqual(['local session cleared'])
    expect(navigation.goToLoginPage).toHaveBeenCalled()

    finishRefresh()
    await logout

    expect(calls).toEqual([
      'local session cleared',
      'refresh settled',
      'api logout',
    ])
  })
})
