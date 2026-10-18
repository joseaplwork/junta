export const API_PREFIX = 'api'

/**
 * Base path of every API resource. The API controllers and the admin API
 * clients both read these values, so a rename updates both sides at once.
 */
export const ApiResource = {
  admins: 'admins',
  auth: 'auth',
  health: 'health',
  juntas: 'juntas',
  me: 'me',
  participantAuth: 'participant-auth',
  participants: 'participants',
} as const

export type ApiResourcePath = (typeof ApiResource)[keyof typeof ApiResource]
