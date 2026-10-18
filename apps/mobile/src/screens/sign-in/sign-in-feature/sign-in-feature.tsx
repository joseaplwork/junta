import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { authErrorKey } from '@/mobile/shared/auth/auth-error'
import { useSession } from '@/mobile/shared/auth/session'
import { Button, ErrorText, TextField } from '@/mobile/shared/components/ui'

export function SignInFeature({
  onRegister,
}: {
  onRegister: () => void
}): React.JSX.Element {
  const { t } = useTranslation()
  const { signIn } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [errorKey, setErrorKey] = useState<string | null>(null)

  const submit = async (): Promise<void> => {
    setBusy(true)
    setErrorKey(null)

    try {
      await signIn({ email, password })
    } catch (error) {
      setErrorKey(authErrorKey(error))
    } finally {
      setBusy(false)
    }
  }

  return (
    <View style={{ gap: 16 }}>
      <TextField
        autoComplete="email"
        keyboardType="email-address"
        label={t('auth.email')}
        onChangeText={setEmail}
        textContentType="emailAddress"
        value={email}
      />
      <TextField
        autoComplete="current-password"
        label={t('auth.password')}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="password"
        value={password}
      />
      {errorKey ? <ErrorText>{t(errorKey)}</ErrorText> : null}
      <Button
        busy={busy}
        label={t('auth.signIn')}
        onPress={() => void submit()}
      />
      <Button label={t('auth.noAccount')} onPress={onRegister} variant="link" />
    </View>
  )
}
