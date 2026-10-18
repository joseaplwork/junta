import { TestBed } from '@angular/core/testing'

import { AuthApi } from '@/admin/shared/api/auth-api'

import { AccessTokenManager } from './access-token-manager'

/** A token whose `exp` claim is `secondsFromNow` away. Signature is irrelevant here. */
const tokenExpiringIn = (secondsFromNow: number): string => {
  const payload = btoa(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + secondsFromNow }),
  )

  return `header.${payload}.signature`
}

describe('AccessTokenManager', () => {
  let tokens: AccessTokenManager
  let resolveRefresh: (accessToken: string) => void
  const authApi = { refresh: jest.fn() }

  beforeEach(() => {
    sessionStorage.clear()
    authApi.refresh.mockReset()
    authApi.refresh.mockImplementation(
      () =>
        new Promise(resolve => {
          resolveRefresh = accessToken => resolve({ accessToken })
        }),
    )

    TestBed.configureTestingModule({
      providers: [{ provide: AuthApi, useValue: authApi }],
    })

    tokens = TestBed.inject(AccessTokenManager)
  })

  it('treats missing, malformed and expired tokens as expired', () => {
    expect(tokens.isExpired(null)).toBe(true)
    expect(tokens.isExpired('not-a-jwt')).toBe(true)
    expect(tokens.isExpired(tokenExpiringIn(-10))).toBe(true)
    expect(tokens.isExpired(tokenExpiringIn(60))).toBe(false)
  })

  it('shares one refresh request between concurrent callers', async () => {
    const first = tokens.refresh()
    const second = tokens.refresh()

    resolveRefresh('fresh')

    await expect(Promise.all([first, second])).resolves.toEqual([
      'fresh',
      'fresh',
    ])
    expect(authApi.refresh).toHaveBeenCalledTimes(1)
    expect(tokens.get()).toBe('fresh')
  })

  it('never restores a token when the session ends during a refresh', async () => {
    tokens.start('current')

    const refresh = tokens.refresh()

    tokens.clear()
    resolveRefresh('late')

    await expect(refresh).rejects.toThrow('session changed')
    expect(tokens.get()).toBeNull()
    expect(sessionStorage.getItem('accessToken')).toBeNull()
  })

  it('keeps a newer login when an older refresh lands late', async () => {
    const refresh = tokens.refresh()

    tokens.start('new-login')
    resolveRefresh('late')

    await expect(refresh).rejects.toThrow('session changed')
    expect(tokens.get()).toBe('new-login')
  })

  it('reports when the refresh in flight has settled', async () => {
    let settled = false
    const refresh = tokens.refresh()

    void tokens.settled().then(() => (settled = true))
    await Promise.resolve()
    expect(settled).toBe(false)

    resolveRefresh('fresh')
    await refresh
    await Promise.resolve()

    expect(settled).toBe(true)
  })
})
