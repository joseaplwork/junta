import { HttpErrorResponse } from '@angular/common/http'

import { apiErrorMessage } from './api-error-message'

const httpError = (error: unknown): HttpErrorResponse =>
  new HttpErrorResponse({ status: 400, error })

describe('apiErrorMessage', () => {
  it('returns the business rule message sent by the API', () => {
    expect(
      apiErrorMessage(
        httpError({
          message: 'Participant p1 is assigned twice',
          rule: 'BR-05',
        }),
        'fallback',
      ),
    ).toBe('Participant p1 is assigned twice')
  })

  it('joins validation messages', () => {
    expect(
      apiErrorMessage(
        httpError({
          message: ['name should not be empty', 'amount must be an integer'],
        }),
        'fallback',
      ),
    ).toBe('name should not be empty. amount must be an integer')
  })

  it('falls back for errors without a message', () => {
    expect(apiErrorMessage(httpError(null), 'fallback')).toBe('fallback')
    expect(apiErrorMessage(new Error('network'), 'fallback')).toBe('fallback')
  })
})
