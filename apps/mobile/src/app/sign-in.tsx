import { Redirect } from 'expo-router'

import { SignInScreen } from '@/mobile/screens/sign-in/sign-in-screen'
import { useSession } from '@/mobile/shared/auth/session'

export default function SignInRoute(): React.JSX.Element {
  const { status } = useSession()

  if (status === 'signedIn') return <Redirect href="/juntas" />

  return <SignInScreen />
}
