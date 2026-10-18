import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useTranslation } from 'react-i18next'

import { SessionProvider } from '@/mobile/shared/auth/session'
import '@/mobile/shared/i18n'

export default function RootLayout(): React.JSX.Element {
  const { t } = useTranslation()

  return (
    <SessionProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="sign-in"
          options={{ title: t('auth.signInTitle') }}
        />
        <Stack.Screen
          name="register"
          options={{ title: t('auth.registerTitle') }}
        />
        <Stack.Screen name="juntas" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </SessionProvider>
  )
}
