import { i18n } from '@/mobile/shared/i18n'

jest.mock('expo-secure-store', () => {
  const store = new Map<string, string>()

  return {
    getItemAsync: jest.fn(async (key: string) => store.get(key) ?? null),
    setItemAsync: jest.fn(async (key: string, value: string) => {
      store.set(key, value)
    }),
    deleteItemAsync: jest.fn(async (key: string) => {
      store.delete(key)
    }),
  }
})

jest.mock('@/mobile/shared/config/api-url', () => ({
  resolveApiUrl: () => 'http://api.test',
}))

beforeAll(async () => {
  await i18n.changeLanguage('es')
})
