# 001: Payment tracking

- **Status:** draft
- **Owner:** unassigned
- **Rules:** BR-04, BR-06, BR-07 (planned), BR-03, BR-09

## Problem

Admins can create juntas and assign groups, but they cannot record who has
paid. The schema already has `Contributions`, `Payouts` and `Distributions`
tables with no endpoints or screens. Admins need to see, per junta and month,
which members paid their share, mark payments, and record the monthly payout
to the group whose turn it is.

## Decisions

Open. This spec cannot be `ready` until the open questions below are answered.

## Scope

- In: monthly contribution schedule per member, marking contributions paid,
  recording the payout and its equal distributions, a junta payment overview in
  the admin.
- Out: reminders and notifications, partial payments (Q-07), participants
  leaving mid-cycle (Q-05), online payments.

## Contract changes (`libs/contracts`)

Sketch, to be confirmed once the decisions are made:

```ts
export interface ContributionResponse {
  id: string
  participantId: string
  groupId: string
  month: number
  amount: number
  status: ContributionStatus
  paidDate: string | null
}

export interface PayoutResponse {
  id: string
  groupId: string
  month: number
  amountReceived: number
  receivedDate: string | null
  isFullyPaid: boolean
  distributions: { participantId: string; amountDistributed: number }[]
}
```

## API changes (`apps/api`)

| Method | Path                                    | Permission            | Notes                                    |
| ------ | --------------------------------------- | --------------------- | ---------------------------------------- |
| GET    | `/api/juntas/:id/contributions?month=n` | `junta:read`          | Schedule for one month                   |
| PATCH  | `/api/contributions/:id`                | new `payment:update`? | Mark paid or overdue (Q-11)              |
| POST   | `/api/juntas/:id/payouts`               | new `payment:create`? | Records the payout and its distributions |

Business rules go in `libs/domain`: `calculateContributionAmount` (BR-04) and
`calculateDistributions` (BR-06), both blocked on Q-01.

## Admin changes (`apps/admin`)

A "Payments" section on the junta details page: a month selector, members with
amount and status, a "mark paid" action and the payout for that month.

## Generator commands

None. These are sub-resources of a junta with custom endpoints, so follow
`apps/api/src/app/juntas/` by hand.

## Acceptance criteria

- [ ] Creating a junta generates one contribution per member per month, with
      the amount from BR-04 (e2e).
- [ ] Marking a contribution paid stores the date and is visible in the
      overview (e2e and component test).
- [ ] Recording a payout creates one distribution per group member with equal
      amounts that add up to the pool (domain test, e2e).
- [ ] Each domain function has tests named after its rule id.

## Test plan

- `libs/domain`: BR-04 and BR-06 against scenarios 1 to 5 of `docs/domain.md`.
- `apps/api`: e2e for each endpoint, including permission failures.
- `apps/admin`: component tests for the payments section.

## Open questions

- **Q-01:** cents or whole units, and who absorbs remainders such as 2000 ÷ 3?
- **Q-07:** are partial payments in scope?
- **Q-10 (new):** are contributions created when the junta is created, or
  lazily per month? What happens to them when groups are edited (Q-06)?
- **Q-11 (new):** who marks a contribution paid, and which permission
  covers it? Should `admin` get it?
- **Q-12 (new):** does `overdue` come from a date rule, such as unpaid after
  day N of the month, or is it set by hand?
