import { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { healthApi } from '@/mobile/shared/api/health-api'

export type ApiStatus = 'checking' | 'online' | 'offline'

/** Shows whether the app can reach the API, with a retry when it cannot. */
export function StatusFeature(): React.JSX.Element {
  const [status, setStatus] = useState<ApiStatus>('checking')

  const check = useCallback(async (): Promise<void> => {
    setStatus('checking')

    try {
      await healthApi.check()
      setStatus('online')
    } catch {
      setStatus('offline')
    }
  }, [])

  useEffect(() => {
    void check()
  }, [check])

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Connection</Text>
      {status === 'checking' && (
        <ActivityIndicator accessibilityLabel="Checking the connection" />
      )}
      {status === 'online' && (
        <Text style={[styles.chip, styles.online]}>Connected to the API</Text>
      )}
      {status === 'offline' && (
        <View style={styles.row}>
          <Text style={[styles.chip, styles.offline]}>
            Cannot reach the API
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => void check()}
            style={styles.retry}>
            <Text style={styles.retryLabel}>Retry</Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    gap: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: { fontSize: 17, fontWeight: '600' },
  row: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  chip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    color: '#ffffff',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  online: { backgroundColor: '#2e7d32' },
  offline: { backgroundColor: '#c62828' },
  retry: { paddingHorizontal: 8, paddingVertical: 6 },
  retryLabel: { color: '#1565c0', fontWeight: '600' },
})
