import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet } from 'react-native'

import { ConnectionStatus } from '@/mobile/shared/components/connection-status'

import { SignInFeature } from './sign-in-feature/sign-in-feature'

export function SignInScreen(): React.JSX.Element {
  const router = useRouter()

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <SignInFeature onRegister={() => router.push('/register')} />
      <ConnectionStatus />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: { gap: 32, padding: 24 },
})
