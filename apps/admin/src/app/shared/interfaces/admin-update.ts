import { Role } from '@junta/shared/enums/role'

export interface AdminUpdateDto {
  email?: string
  roles?: Role[]
  name?: string
  surname?: string
  phoneNumber?: string
  password?: string
}
