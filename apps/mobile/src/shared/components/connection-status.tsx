import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

import { healthApi } from '@/mobile/shared/api/health-api'

import { Button, colors } from './ui'

export type ApiStatus = 'checking' | 'online' | 'offline'

/** Shows whether the app can reach the API, with a retry when it cannot. */
export function ConnectionStatus(): React.JSX.Element {
  const { t } = useTranslation()
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

  if (status === 'checking') {
    return <ActivityIndicator accessibilityLabel={t('connection.checking')} />
  }

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.dot,
          status === 'online' ? styles.online : styles.offline,
        ]}
      />
      <Text style={styles.label}>
        {t(status === 'online' ? 'connection.online' : 'connection.offline')}
      </Text>
      {status === 'offline' && (
        <Button
          label={t('common.retry')}
          onPress={() => void check()}
          variant="link"
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  dot: { borderRadius: 4, height: 8, width: 8 },
  online: { backgroundColor: colors.success },
  offline: { backgroundColor: colors.danger },
  label: { color: colors.muted, fontSize: 13 },
})
