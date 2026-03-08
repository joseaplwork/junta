export interface Junta {
  id: string
  name: string
  amount: number
  groups: number
  partialAmount: number
  startDate: string
  endDate: string
  active: boolean
  adminId: string
}

export interface JuntaDTO {
  id: string
  name: string
  amount: number
  groups: number
  partial_amount: number
  start_date: string
  end_date: string
  active: boolean
  admin_id: string
}
