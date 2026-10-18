import { provideHttpClient } from '@angular/common/http'
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'

import { environment } from '../../../environments/environment'

import { HealthApi } from './health-api'

describe('HealthApi', () => {
  let api: HealthApi
  let http: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })

    api = TestBed.inject(HealthApi)
    http = TestBed.inject(HttpTestingController)
  })

  afterEach(() => http.verify())

  it('checks the public health endpoint', async () => {
    const result = api.check()

    http
      .expectOne({ method: 'GET', url: `${environment.apiUrl}/api/health` })
      .flush({ status: 'ok' })

    await expect(result).resolves.toEqual({ status: 'ok' })
  })
})
