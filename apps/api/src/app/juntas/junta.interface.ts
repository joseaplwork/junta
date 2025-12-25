export interface JuntaPayload {
  name: string
  amount: number
  slots: number
  startDate: string
  endDate: string
  active: boolean
}

export type JuntaUpdatePayload = Partial<JuntaPayload>
