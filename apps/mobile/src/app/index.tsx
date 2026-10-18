import { Redirect } from 'expo-router'
import { ActivityIndicator } from 'react-native'

import { useSession } from '@/mobile/shared/auth/session'

/** Sends the user to their juntas or to sign-in once the stored session is read. */
export default function StartRoute(): React.JSX.Element {
  const { status } = useSession()

  if (status === 'loading') return <ActivityIndicator style={{ flex: 1 }} />

  return <Redirect href={status === 'signedIn' ? '/juntas' : '/sign-in'} />
}
