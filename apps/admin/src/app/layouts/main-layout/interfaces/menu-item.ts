import { Permission } from '@junta/contracts'

export interface MenuItem {
  label: string
  icon: string
  route: string
  /** Hidden unless the admin holds this permission. */
  permission?: Permission
  exact?: boolean
}
