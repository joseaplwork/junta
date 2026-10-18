import { Redirect } from 'expo-router'

import { RegisterScreen } from '@/mobile/screens/register/register-screen'
import { useSession } from '@/mobile/shared/auth/session'

export default function RegisterRoute(): React.JSX.Element {
  const { status } = useSession()

  if (status === 'signedIn') return <Redirect href="/juntas" />

  return <RegisterScreen />
}
