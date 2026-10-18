import { Redirect, Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { useSession } from '@/mobile/shared/auth/session'
import { Button } from '@/mobile/shared/components/ui'

/** Everything under /juntas needs a signed-in participant. */
export default function JuntasLayout(): React.JSX.Element {
  const { t } = useTranslation()
  const { status, signOut } = useSession()

  if (status === 'signedOut') return <Redirect href="/sign-in" />

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: t('juntas.title'),
          headerRight: () => (
            <Button
              label={t('auth.signOut')}
              onPress={() => void signOut()}
              variant="link"
            />
          ),
        }}
      />
      <Stack.Screen name="[id]" options={{ title: '' }} />
    </Stack>
  )
}
