import { useLocalSearchParams } from 'expo-router'

import { JuntaDetailScreen } from '@/mobile/screens/junta-detail/junta-detail-screen'

export default function JuntaDetailRoute(): React.JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>()

  return <JuntaDetailScreen id={id} />
}
