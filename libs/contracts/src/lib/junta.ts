export interface GroupAssignment {
  /** Optional display name chosen by the admin. */
  name?: string
  /** Payout order. Order 1 receives the pool in month 1, order 2 in month 2, and so on. */
  order: number
  participantIds: string[]
}

export interface CreateJuntaRequest {
  name: string
  /** Pool collected every month and paid out in full to one group. Whole currency units. */
  amount: number
  /** ISO 4217 code of the junta's currency, such as MXN or PEN (BR-13). */
  currency: string
  /** Calendar date, `YYYY-MM-DD`, after today (BR-17). */
  startDate: string
  /** Calendar date, `YYYY-MM-DD`. */
  endDate: string
  /** One entry per month of the junta, see BR-01 in docs/domain.md. */
  groups: GroupAssignment[]
}

export type UpdateJuntaRequest = Partial<CreateJuntaRequest>

export interface JuntaResponse {
  id: string
  name: string
  amount: number
  /** ISO 4217 code, see BR-13 in docs/domain.md. */
  currency: string
  groupCount: number
  /** Monthly amount each group collects, see BR-03 in docs/domain.md. */
  groupAmount: number
  /** Calendar date, `YYYY-MM-DD`. */
  startDate: string
  /** Calendar date, `YYYY-MM-DD`. */
  endDate: string
  /** True while today is within the start and end dates. Not stored. */
  active: boolean
  /** The account that created and runs the junta (BR-16). */
  organizerId: string
}

export interface GroupMemberResponse {
  id: string
  name: string
  surname: string
}

export interface GroupResponse {
  id: string
  name: string | null
  order: number
  members: GroupMemberResponse[]
}

export interface JuntaDetailResponse extends JuntaResponse {
  groups: GroupResponse[]
}
