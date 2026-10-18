import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet } from 'react-native'

import { RegisterFeature } from './register-feature/register-feature'

export function RegisterScreen(): React.JSX.Element {
  const router = useRouter()

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <RegisterFeature onSignIn={() => router.back()} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: { padding: 24 },
})
