import * as SecureStore from 'expo-secure-store'

import { TokenPairResponse } from '@junta/contracts'

const KEY = 'junta.session'

type Listener = (tokens: TokenPairResponse | null) => void

let current: TokenPairResponse | null = null
const listeners = new Set<Listener>()

/** Tokens live in the device keychain (iOS) or keystore (Android), never in plain storage. */
export const tokenStore = {
  async load(): Promise<TokenPairResponse | null> {
    const stored = await SecureStore.getItemAsync(KEY)

    current = stored ? (JSON.parse(stored) as TokenPairResponse) : null

    return current
  },

  get(): TokenPairResponse | null {
    return current
  },

  async set(tokens: TokenPairResponse | null): Promise<void> {
    current = tokens

    if (tokens) await SecureStore.setItemAsync(KEY, JSON.stringify(tokens))
    else await SecureStore.deleteItemAsync(KEY)

    for (const listener of listeners) listener(tokens)
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener)

    return () => listeners.delete(listener)
  },
}
