import { useRouter } from 'expo-router'

import { JuntaListFeature } from './junta-list-feature/junta-list-feature'

export function MyJuntasScreen(): React.JSX.Element {
  const router = useRouter()

  return <JuntaListFeature onOpen={id => router.push(`/juntas/${id}`)} />
}
