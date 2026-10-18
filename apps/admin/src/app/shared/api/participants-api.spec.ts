import { provideHttpClient } from '@angular/common/http'
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'

import { ParticipantResponse } from '@junta/contracts'

import { environment } from '../../../environments/environment'

import { ParticipantsApi } from './participants-api'

const participant: ParticipantResponse = {
  id: 'participant-1',
  name: 'Ana',
  surname: 'Diaz',
  phoneNumber: '600111222',
}

describe('ParticipantsApi', () => {
  let api: ParticipantsApi
  let http: HttpTestingController
  const baseUrl = `${environment.apiUrl}/api/participants`

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })

    api = TestBed.inject(ParticipantsApi)
    http = TestBed.inject(HttpTestingController)
  })

  afterEach(() => http.verify())

  it('lists participants', async () => {
    const result = api.list()

    http.expectOne({ method: 'GET', url: baseUrl }).flush([participant])

    await expect(result).resolves.toEqual([participant])
  })

  it('creates a participant with the request body', async () => {
    const request = { name: 'Ana', surname: 'Diaz', phoneNumber: '600111222' }
    const result = api.create(request)
    const call = http.expectOne({ method: 'POST', url: baseUrl })

    expect(call.request.body).toEqual(request)
    call.flush(participant)

    await expect(result).resolves.toEqual(participant)
  })

  it('patches only the changed fields', async () => {
    const result = api.update('participant-1', { phoneNumber: '699000000' })
    const call = http.expectOne({
      method: 'PATCH',
      url: `${baseUrl}/participant-1`,
    })

    expect(call.request.body).toEqual({ phoneNumber: '699000000' })
    call.flush({ ...participant, phoneNumber: '699000000' })

    await expect(result).resolves.toMatchObject({ phoneNumber: '699000000' })
  })

  it('deletes by id', async () => {
    const result = api.remove('participant-1')

    http
      .expectOne({ method: 'DELETE', url: `${baseUrl}/participant-1` })
      .flush(null, { status: 204, statusText: 'No Content' })

    await expect(result).resolves.toBeNull()
  })
})
