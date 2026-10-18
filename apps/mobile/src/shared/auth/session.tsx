import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { LoginRequest, RegisterRequest } from '@junta/contracts'

import { mobileAuthApi } from '@/mobile/shared/api/mobile-auth-api'

import { tokenStore } from './token-store'

export type SessionStatus = 'loading' | 'signedOut' | 'signedIn'

export interface Session {
  status: SessionStatus
  signIn: (request: LoginRequest) => Promise<void>
  register: (request: RegisterRequest) => Promise<void>
  signOut: () => Promise<void>
}

const SessionContext = createContext<Session | null>(null)

/** Restores the stored session at launch and follows token changes, such as a failed refresh. */
export function SessionProvider({
  children,
}: {
  children: ReactNode
}): React.JSX.Element {
  const [status, setStatus] = useState<SessionStatus>('loading')

  useEffect(() => {
    const unsubscribe = tokenStore.subscribe(tokens =>
      setStatus(tokens ? 'signedIn' : 'signedOut'),
    )

    void tokenStore
      .load()
      .then(tokens => setStatus(tokens ? 'signedIn' : 'signedOut'))
      .catch(() => setStatus('signedOut'))

    return unsubscribe
  }, [])

  const signIn = useCallback(async (request: LoginRequest) => {
    await tokenStore.set(await mobileAuthApi.login(request))
  }, [])

  const register = useCallback(async (request: RegisterRequest) => {
    await tokenStore.set(await mobileAuthApi.register(request))
  }, [])

  const signOut = useCallback(async () => {
    const refreshToken = tokenStore.get()?.refreshToken

    await tokenStore.set(null)

    if (refreshToken)
      await mobileAuthApi.logout(refreshToken).catch(() => undefined)
  }, [])

  const session = useMemo(
    () => ({ status, signIn, register, signOut }),
    [status, signIn, register, signOut],
  )

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession(): Session {
  const session = useContext(SessionContext)

  if (!session)
    throw new Error('useSession must be used inside SessionProvider')

  return session
}
