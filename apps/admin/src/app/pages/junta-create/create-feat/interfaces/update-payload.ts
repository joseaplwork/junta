import { GroupConfig } from '@/admin/shared/interfaces/group'

export interface UpdatePayload {
  name?: string
  amount?: number
  startDate?: string
  endDate?: string
  active?: boolean
  groupConfigs?: GroupConfig[]
}
