import { Role } from '@junta/shared/enums/role'

export interface UpdatePayload {
  email?: string
  roles?: Role[]
}
