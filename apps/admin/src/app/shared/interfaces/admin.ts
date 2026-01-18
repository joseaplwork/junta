import { Role } from '@junta/shared/enums/role'

import { Participant } from './participant'

export interface Admin {
  id: string
  email: string
  roles: Role[]
  participant: Participant
}
