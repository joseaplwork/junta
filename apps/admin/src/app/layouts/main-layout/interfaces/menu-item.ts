import { Permission } from '@junta/shared/enums/permission'

export interface MenuItem {
  label: string
  icon: string
  route: string
  permission?: Permission
  exact?: boolean
}
