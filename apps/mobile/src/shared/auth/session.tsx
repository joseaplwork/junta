import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  ParticipantLoginRequest,
  ParticipantRegisterRequest,
} from '@junta/contracts'

import { participantAuthApi } from '@/mobile/shared/api/participant-auth-api'

import { tokenStore } from './token-store'

export type SessionStatus = 'loading' | 'signedOut' | 'signedIn'

export interface Session {
  status: SessionStatus
  signIn: (request: ParticipantLoginRequest) => Promise<void>
  register: (request: ParticipantRegisterRequest) => Promise<void>
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

  const signIn = useCallback(async (request: ParticipantLoginRequest) => {
    await tokenStore.set(await participantAuthApi.login(request))
  }, [])

  const register = useCallback(async (request: ParticipantRegisterRequest) => {
    await tokenStore.set(await participantAuthApi.register(request))
  }, [])

  const signOut = useCallback(async () => {
    const refreshToken = tokenStore.get()?.refreshToken

    await tokenStore.set(null)

    if (refreshToken)
      await participantAuthApi.logout(refreshToken).catch(() => undefined)
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
