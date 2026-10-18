import Constants from 'expo-constants'

/** Placeholder until the API is deployed (open question in spec 003). */
export const PRODUCTION_API_URL = 'https://api.example.com'

/**
 * Where the app finds the API, in order:
 * 1. `EXPO_PUBLIC_API_URL`, when set.
 * 2. In development, port 3000 on the machine running the Expo dev server, so a
 *    phone on the same Wi-Fi reaches the local API.
 * 3. The production URL.
 */
export function resolveApiUrl(
  configured: string | undefined = process.env['EXPO_PUBLIC_API_URL'],
  devServerHost: string | undefined = Constants.expoConfig?.hostUri,
  development: boolean = __DEV__,
): string {
  if (configured) return configured

  const host = devServerHost?.split(':')[0]

  if (development && host) return `http://${host}:3000`

  return PRODUCTION_API_URL
}
