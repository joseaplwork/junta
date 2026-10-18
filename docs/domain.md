# Domain: La Junta

This file is the source of truth for business behavior. Code that implements a
rule cites its id (for example `BR-05`) and has a test named after it. To change
behavior, change the rule here first, then the code and its test.

If a request touches money, rounding, roles or deletion and this file does not
answer it, ask the product owner instead of guessing. Record the answer here.

## What a junta is

A junta is a traditional rotating savings group. A fixed set of people pays in
every month for a fixed number of months. Each month the whole pool goes to one
group of participants, in an order drawn by raffle. Everyone keeps paying until
the junta ends, whether or not their group has already been paid.

The system records who takes part, how much they owe, the payout order and
every money movement. The money itself changes hands offline.

## Glossary

| Term         | Meaning                                                        | In code                                          |
| ------------ | -------------------------------------------------------------- | ------------------------------------------------ |
| Junta        | One savings cycle with a start date, an end date and a pool.   | `Junta` entity, `JuntaResponse`                  |
| Pool amount  | Money collected every month and paid out in full to one group. | `Junta.amount`                                   |
| Group        | The participants who receive the pool together in one month.   | `Group` entity, `GroupResponse`                  |
| Group count  | Number of groups, equal to the number of months.               | `Junta.groupCount` (column `groups`)             |
| Group amount | What each group collects per month: pool ÷ group count.        | `Junta.groupAmount` (column `partial_amount`)    |
| Payout order | The month in which a group receives the pool. 1 = first month. | `Group.order`                                    |
| Member       | A participant assigned to a group of a junta.                  | `ParticipantGroup` entity, `GroupMemberResponse` |
| Participant  | A person who can take part in juntas.                          | `Participant` entity                             |
| Admin        | A back-office user. Always linked to a participant.            | `Admin` entity                                   |
| Contribution | A member's payment for one month.                              | `Contribution` entity (no endpoints yet)         |
| Payout       | The pool paid to one group in one month.                       | `Payout` entity (no endpoints yet)               |
| Distribution | One member's equal share of a payout.                          | `Distribution` entity (no endpoints yet)         |
| Raffle       | The random draw that sets the initial payout order.            | `shuffle()` in `libs/domain`                     |

## Business rules

Status values: **enforced** means code rejects violations, **partial** means
only some paths enforce it, **planned** means the rule is agreed but not built.

| Id    | Rule                                                                                                         | Status   | Where                                                          |
| ----- | ------------------------------------------------------------------------------------------------------------ | -------- | -------------------------------------------------------------- |
| BR-01 | A junta has one group per calendar month from the start month to the end month, inclusive, and at least one. | partial  | `junta-schedule.ts` (admin form), `group-assignments.ts` (API) |
| BR-02 | Payout orders are 1 to n with no gaps or repeats. Order n receives the pool in month n.                      | enforced | `group-assignments.ts`                                         |
| BR-03 | Each group collects pool ÷ group count every month, floored to whole units. See Q-01.                        | enforced | `junta-financials.ts`                                          |
| BR-04 | Each member pays group amount ÷ members of their group every month.                                          | planned  |                                                                |
| BR-05 | A participant belongs to at most one group per junta.                                                        | enforced | `group-assignments.ts`                                         |
| BR-06 | In its month a group receives the full pool and splits it equally among its members.                         | planned  |                                                                |
| BR-07 | Every member pays every month until the junta ends, whether or not their group was already paid.             | planned  |                                                                |
| BR-08 | A raffle draws the initial payout order. Admins may change the order afterwards.                             | partial  | `raffle.ts` (admin form only)                                  |
| BR-09 | A participant may take part in several juntas at once. Each junta tracks money independently.                | enforced | data model                                                     |
| BR-10 | Money changes hands offline. The system only records it.                                                     | enforced | by design                                                      |
| BR-11 | Every admin is linked to exactly one participant, created together.                                          | enforced | `AdminsService.create`                                         |
| BR-12 | Permissions derive from roles. A super admin holds every permission.                                         | enforced | `permissions.ts`, `PermissionsGuard`                           |

Rule files live in `libs/domain/src/lib/`. Services live in `apps/api/src/app/`.

## Money flow

Per month, for a junta with pool `P`, `G` groups and `m` members in a group:

- **Collection (BR-03, BR-04):** each group collects `P ÷ G`. Each of its
  members pays `(P ÷ G) ÷ m`.
- **Payout (BR-06):** the group whose order equals the month receives `P`.
- **Distribution (BR-06):** each member of that group receives `P ÷ m`.
- Across all groups the monthly collection adds up to `P`, which is paid out in
  the same month.

## Scenarios

These double as test cases. Scenario 2 is covered by
`libs/domain/src/lib/group-assignments.spec.ts` and `apps/api/test/juntas.e2e-spec.ts`.

1. **2000, 2 months, 2 participants.** 2 groups. Each group collects 1000 a
   month. Each participant pays 1000 a month and receives 2000 in their month.
2. **2000, 2 months, 3 participants.** Group 1 has 1 participant who pays 1000
   a month and receives 2000. Group 2 has 2 participants who pay 500 each a
   month and receive 1000 each.
3. **2000, 4 months, 4 participants.** Each group collects 500 a month. Each
   participant pays 500 and receives 2000 in their month.
4. **2000, 4 months, 8 participants.** Each group of 2 collects 500 a month.
   Each participant pays 250 and receives 1000 in their group's month.
5. **2000, 4 months, 7 participants.** Groups of 2, 2, 2 and 1. Members of a
   pair pay 250 and receive 1000. The single member pays 500 and receives 2000.
6. **One participant, two juntas.** Junta A and junta B track contributions,
   payouts and distributions independently. Amounts and payout months differ.

## Roles

| Role          | Can do                                                       |
| ------------- | ------------------------------------------------------------ |
| `superAdmin`  | Everything, including managing admins.                       |
| `admin`       | Create, read, update and delete juntas and participants.     |
| `participant` | Read juntas and participants. No participant app exists yet. |

The mapping is `ROLE_PERMISSIONS` in `libs/domain/src/lib/permissions.ts`.

## Data model

The TypeORM entities in `apps/api/src/app/**/entities/` are the only schema
definition. Tables keep their historical names, for example `Administrators`
and `ParticipantsGroups`.

- `Juntas` belong to one `Administrators` row and own many `Groups`.
- `ParticipantsGroups` links `Participants` to `Groups`. It is the membership
  table.
- `Contributions`, `Payouts` and `Distributions` reference the junta, the group
  or payout and the participant. They exist in the schema without endpoints.
- The local development database also contains `Payments` and `Receipts`.
  Those tables belong to no entity and are leftovers from an earlier model.

## Open questions

Answer these with the product owner before building the related features.

| Id   | Question                                                                                                                          | Current behavior                                                                              |
| ---- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Q-01 | Should amounts keep cents? Flooring 2000 ÷ 3 to 666 leaves 2 units per month uncollected. Who absorbs remainders?                 | Group amount is floored to whole units and stored as int.                                     |
| Q-02 | Which currency and locale? The examples use euros but the admin formats Mexican pesos.                                            | `es-MX` and `MXN` in `apps/admin/src/app/shared/pipes/money-pipe.ts`.                         |
| Q-03 | Should the API reject a group count that differs from the number of months (BR-01)? A timezone-safe check needs date-only fields. | Only the admin form builds one group per month.                                               |
| Q-04 | How exactly does the raffle work: pure random, weighted, or recorded for audit?                                                   | Uniform random shuffle in the admin form.                                                     |
| Q-05 | What happens when a participant leaves mid-cycle?                                                                                 | Not handled.                                                                                  |
| Q-06 | Can the payout order change after money has been distributed?                                                                     | Not handled. Updating a junta replaces all its groups.                                        |
| Q-07 | How are partial payments recorded?                                                                                                | Not handled.                                                                                  |
| Q-08 | What is the minimum duration? An earlier draft said 1 month in one place and 2 in another.                                        | The admin form requires an end date at least one month after the start, so at least 2 groups. |
| Q-09 | Can the leftover `Payments` and `Receipts` tables be dropped from the development database?                                       | Left untouched.                                                                               |
| Q-10 | Are contributions created with the junta or month by month? What happens to them when groups are edited?                          | No contributions are created. See spec 001.                                                   |
| Q-11 | Who marks a contribution as paid, and under which permission?                                                                     | No endpoint. See spec 001.                                                                    |
| Q-12 | Does `overdue` follow a date rule, such as unpaid after day N of the month, or is it set by hand?                                 | No endpoint. See spec 001.                                                                    |
