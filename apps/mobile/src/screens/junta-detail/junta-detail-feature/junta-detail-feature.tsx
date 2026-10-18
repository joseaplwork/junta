import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { MyJuntaDetailResponse } from '@junta/contracts'

import { meApi } from '@/mobile/shared/api/me-api'
import { Button, Card, ErrorText, colors } from '@/mobile/shared/components/ui'
import {
  formatDate,
  formatMoney,
  formatMonth,
} from '@/mobile/shared/format/format'

type State =
  | { kind: 'loading' }
  | { kind: 'error' }
  | { kind: 'loaded'; junta: MyJuntaDetailResponse }

export function JuntaDetailFeature({ id }: { id: string }): React.JSX.Element {
  const { t } = useTranslation()
  const [state, setState] = useState<State>({ kind: 'loading' })

  const load = useCallback(async (): Promise<void> => {
    setState({ kind: 'loading' })

    try {
      setState({ kind: 'loaded', junta: await meApi.junta(id) })
    } catch {
      setState({ kind: 'error' })
    }
  }, [id])

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

  const { junta } = state

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.caption}>{t('juntas.monthlyPool')}</Text>
        <Text style={styles.amount}>
          {formatMoney(junta.amount, junta.currency)}
        </Text>
        <Text style={styles.detail}>
          {t('juntas.schedule', {
            start: formatDate(junta.startDate),
            end: formatDate(junta.endDate),
          })}
        </Text>
        {!junta.active && (
          <Text style={styles.inactive}>{t('juntas.inactive')}</Text>
        )}
      </Card>
      <Card>
        <Text style={styles.highlight}>
          {t('juntas.payout', { month: formatMonth(junta.payoutDate) })}
        </Text>
        <Text style={styles.detail}>
          {t('juntas.payoutTurn', {
            order: junta.payoutOrder,
            count: junta.groupCount,
          })}
        </Text>
        <Text style={styles.detail}>
          {t('juntas.groupPays', {
            amount: formatMoney(junta.groupAmount, junta.currency),
          })}
        </Text>
      </Card>
      <Card>
        <Text style={styles.caption}>{t('juntas.yourGroup')}</Text>
        <Text style={styles.detail}>
          {t('juntas.groupSize', { count: junta.groupSize })}
        </Text>
        {junta.groupMembers.map(member => (
          <Text key={`${member.name}-${member.surname}`} style={styles.member}>
            {member.name} {member.surname}
          </Text>
        ))}
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: { gap: 12, padding: 16 },
  center: { alignItems: 'center', gap: 8, padding: 24 },
  caption: { color: colors.muted, fontSize: 13, textTransform: 'uppercase' },
  amount: { color: colors.primary, fontSize: 28, fontWeight: '700' },
  highlight: { color: colors.text, fontSize: 18, fontWeight: '600' },
  detail: { color: colors.muted, fontSize: 14 },
  member: { color: colors.text, fontSize: 16 },
  inactive: { color: colors.danger, fontSize: 13, fontWeight: '600' },
})
