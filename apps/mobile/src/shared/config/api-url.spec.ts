import { PRODUCTION_API_URL, resolveApiUrl } from './api-url'

jest.unmock('@/mobile/shared/config/api-url')
jest.mock('expo-constants', () => ({ expoConfig: {} }))

describe('resolveApiUrl', () => {
  it('prefers EXPO_PUBLIC_API_URL', () => {
    expect(
      resolveApiUrl('https://staging.test', '192.168.1.5:8081', true),
    ).toBe('https://staging.test')
  })

  it('uses the dev server machine in development', () => {
    expect(resolveApiUrl(undefined, '192.168.1.5:8081', true)).toBe(
      'http://192.168.1.5:3000',
    )
  })

  it('falls back to the production URL', () => {
    expect(resolveApiUrl(undefined, '192.168.1.5:8081', false)).toBe(
      PRODUCTION_API_URL,
    )
  })
})
