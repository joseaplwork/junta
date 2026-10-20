/** A junta as the signed-in participant sees it (BR-15). */
export interface MyJuntaSummaryResponse {
  id: string
  name: string
  /** Monthly pool, whole units of `currency` (BR-03, BR-13). */
  amount: number
  currency: string
  /** Calendar date, `YYYY-MM-DD`. */
  startDate: string
  /** Calendar date, `YYYY-MM-DD`. */
  endDate: string
  /** True while today is within the start and end dates. Not stored. */
  active: boolean
  /** Payout order of the participant's group: month n of the junta (BR-02). */
  payoutOrder: number
  /** Calendar date of that month, `YYYY-MM-DD` (BR-02). */
  payoutDate: string
  /** What the participant's group collects every month (BR-03). */
  groupAmount: number
  /** Members in the participant's group, the participant included. */
  groupSize: number
}

export interface MyGroupMemberResponse {
  name: string
  surname: string
}

export interface MyJuntaDetailResponse extends MyJuntaSummaryResponse {
  groupCount: number
  /** Names of the participant's own group only (BR-15). */
  groupMembers: MyGroupMemberResponse[]
}
