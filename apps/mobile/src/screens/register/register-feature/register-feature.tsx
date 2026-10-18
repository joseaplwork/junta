import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { RegisterRequest } from '@junta/contracts'

import { authErrorKey } from '@/mobile/shared/auth/auth-error'
import { useSession } from '@/mobile/shared/auth/session'
import { Button, ErrorText, TextField } from '@/mobile/shared/components/ui'

const EMPTY: RegisterRequest = {
  email: '',
  password: '',
  name: '',
  surname: '',
  phoneNumber: '',
}

export function RegisterFeature({
  onSignIn,
}: {
  onSignIn: () => void
}): React.JSX.Element {
  const { t } = useTranslation()
  const { register } = useSession()
  const [form, setForm] = useState(EMPTY)
  const [busy, setBusy] = useState(false)
  const [errorKey, setErrorKey] = useState<string | null>(null)

  const field =
    (key: keyof RegisterRequest) =>
    (value: string): void =>
      setForm(current => ({ ...current, [key]: value }))

  const submit = async (): Promise<void> => {
    setBusy(true)
    setErrorKey(null)

    try {
      await register(form)
    } catch (error) {
      setErrorKey(authErrorKey(error))
    } finally {
      setBusy(false)
    }
  }

  return (
    <View style={{ gap: 16 }}>
      <TextField
        label={t('auth.name')}
        onChangeText={field('name')}
        value={form.name}
      />
      <TextField
        label={t('auth.surname')}
        onChangeText={field('surname')}
        value={form.surname}
      />
      <TextField
        keyboardType="phone-pad"
        label={t('auth.phoneNumber')}
        onChangeText={field('phoneNumber')}
        textContentType="telephoneNumber"
        value={form.phoneNumber}
      />
      <TextField
        autoComplete="email"
        keyboardType="email-address"
        label={t('auth.email')}
        onChangeText={field('email')}
        textContentType="emailAddress"
        value={form.email}
      />
      <TextField
        autoComplete="new-password"
        hint={t('auth.passwordHint')}
        label={t('auth.password')}
        onChangeText={field('password')}
        secureTextEntry
        textContentType="newPassword"
        value={form.password}
      />
      {errorKey ? <ErrorText>{t(errorKey)}</ErrorText> : null}
      <Button
        busy={busy}
        label={t('auth.register')}
        onPress={() => void submit()}
      />
      <Button label={t('auth.haveAccount')} onPress={onSignIn} variant="link" />
    </View>
  )
}
