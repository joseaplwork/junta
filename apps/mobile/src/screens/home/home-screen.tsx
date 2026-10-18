import { ScrollView, StyleSheet, Text } from 'react-native'

import { StatusFeature } from './status-feature/status-feature'

export function HomeScreen(): React.JSX.Element {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.intro}>
        Your juntas, your payout month and your payments will appear here once
        participants can sign in.
      </Text>
      <StatusFeature />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: { gap: 16, padding: 16 },
  intro: { color: '#424242', fontSize: 15, lineHeight: 21 },
})
