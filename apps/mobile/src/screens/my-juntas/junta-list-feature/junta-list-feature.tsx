import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { MyJuntaSummaryResponse } from '@junta/contracts'

import { meApi } from '@/mobile/shared/api/me-api'
import { Button, Card, ErrorText, colors } from '@/mobile/shared/components/ui'
import { formatMoney, formatMonth } from '@/mobile/shared/format/format'

type State =
  | { kind: 'loading' }
  | { kind: 'error' }
  | { kind: 'loaded'; juntas: MyJuntaSummaryResponse[] }

export function JuntaListFeature({
  onOpen,
}: {
  onOpen: (id: string) => void
}): React.JSX.Element {
  const { t } = useTranslation()
  const [state, setState] = useState<State>({ kind: 'loading' })

  const load = useCallback(async (): Promise<void> => {
    setState({ kind: 'loading' })

    try {
      setState({ kind: 'loaded', juntas: await meApi.juntas() })
    } catch {
      setState({ kind: 'error' })
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  if (state.kind === 'loading')
    return <ActivityIndicator accessibilityLabel={t('common.loading')} />

  if (state.kind === 'error') {
    return (
      <View style={styles.center}>
        <ErrorText>{t('common.genericError')}</ErrorText>
        <Button
          label={t('common.retry')}
          onPress={() => void load()}
          variant="link"
        />
      </View>
    )
  }

  // ScrollView, not FlatList: a participant has few juntas, and VirtualizedList
  // layout loops can hang `await render` under CI load.
  return (
    <ScrollView contentContainerStyle={styles.list}>
      {state.juntas.length === 0 ? (
        <Text style={styles.empty}>{t('juntas.empty')}</Text>
      ) : (
        state.juntas.map(item => (
          <Pressable
            accessibilityRole="button"
            key={item.id}
            onPress={() => onOpen(item.id)}
          >
            <Card>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.amount}>
                {formatMoney(item.amount, item.currency)}
              </Text>
              <Text style={styles.detail}>
                {t('juntas.payout', { month: formatMonth(item.payoutDate) })}
              </Text>
              <Text style={styles.detail}>
                {t('juntas.groupPays', {
                  amount: formatMoney(item.groupAmount, item.currency),
                })}
              </Text>
            </Card>
          </Pressable>
        ))
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  list: { gap: 12, padding: 16 },
  center: { alignItems: 'center', gap: 8, padding: 24 },
  empty: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
    padding: 8,
    textAlign: 'center',
  },
  name: { color: colors.text, fontSize: 17, fontWeight: '600' },
  amount: { color: colors.primary, fontSize: 22, fontWeight: '700' },
  detail: { color: colors.muted, fontSize: 14 },
})
