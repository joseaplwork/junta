export interface GroupConfig {
  name?: string
  order: number
  participantIds: string[]
}

export interface JuntaPayload {
  name: string
  amount: number
  startDate: string
  endDate: string
  active: boolean
  groupConfigs: GroupConfig[]
}

export interface JuntaUpdatePayload {
  name?: string
  amount?: number
  startDate?: string
  endDate?: string
  active?: boolean
  groupConfigs?: GroupConfig[]
}
