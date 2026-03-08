import { GroupConfig } from '@/admin/shared/interfaces/group'

export interface CreatePayload {
  name: string
  amount: number
  startDate: string
  endDate: string
  active: boolean
  groupConfigs: GroupConfig[]
}
