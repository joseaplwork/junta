import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http'
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { firstValueFrom } from 'rxjs'

import { AccessTokenManager } from '@/admin/shared/services/access-token-manager'
import { AdminSession } from '@/admin/shared/services/admin-session'

import { authInterceptor } from './auth-interceptor'

describe('authInterceptor', () => {
  let http: HttpClient
  let backend: HttpTestingController
  const tokens = { get: jest.fn(), refresh: jest.fn() }
  const session = { end: jest.fn() }

  beforeEach(() => {
    jest.clearAllMocks()
    tokens.get.mockReturnValue('old-token')

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AccessTokenManager, useValue: tokens },
        { provide: AdminSession, useValue: session },
      ],
    })

    http = TestBed.inject(HttpClient)
    backend = TestBed.inject(HttpTestingController)
  })

  afterEach(() => backend.verify())

  it('adds the access token as a bearer header', async () => {
    const response = firstValueFrom(http.get('/api/participants'))
    const call = backend.expectOne('/api/participants')

    expect(call.request.headers.get('Authorization')).toBe('Bearer old-token')
    call.flush([])

    await expect(response).resolves.toEqual([])
  })

  it('leaves login, refresh and logout untouched', async () => {
    const response = firstValueFrom(http.post('/api/auth/login', {}))
    const call = backend.expectOne('/api/auth/login')

    expect(call.request.headers.has('Authorization')).toBe(false)
    call.flush({ accessToken: 'token' })

    await response
  })

  it('refreshes once on 401 and retries with the new token', async () => {
    tokens.refresh.mockResolvedValue('new-token')

    const response = firstValueFrom(http.get('/api/juntas'))

    backend
      .expectOne('/api/juntas')
      .flush(null, { status: 401, statusText: 'Unauthorized' })
    await Promise.resolve()

    const retry = backend.expectOne('/api/juntas')

    expect(retry.request.headers.get('Authorization')).toBe('Bearer new-token')
    retry.flush([{ id: 'junta-1' }])

    await expect(response).resolves.toEqual([{ id: 'junta-1' }])
    expect(tokens.refresh).toHaveBeenCalledTimes(1)
  })

  it('ends the session when the refresh fails', async () => {
    tokens.refresh.mockRejectedValue(new Error('refresh rejected'))

    const response = firstValueFrom(http.get('/api/juntas'))

    backend
      .expectOne('/api/juntas')
      .flush(null, { status: 401, statusText: 'Unauthorized' })

    await expect(response).rejects.toThrow('refresh rejected')
    expect(session.end).toHaveBeenCalled()
  })

  it('passes other errors through without refreshing', async () => {
    const response = firstValueFrom(http.get('/api/juntas'))

    backend
      .expectOne('/api/juntas')
      .flush(null, { status: 500, statusText: 'Server Error' })

    await expect(response).rejects.toMatchObject({ status: 500 })
    expect(tokens.refresh).not.toHaveBeenCalled()
  })
})
