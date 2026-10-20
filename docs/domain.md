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

| Term         | Meaning                                                                                                      | In code                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| Junta        | One savings cycle with a start date, an end date and a pool.                                                 | `Junta` entity, `JuntaResponse`                  |
| Pool amount  | Money collected every month and paid out in full to one group.                                               | `Junta.amount`                                   |
| Currency     | ISO 4217 code of the junta's money, such as MXN or PEN.                                                      | `Junta.currency`                                 |
| Group        | The participants who receive the pool together in one month.                                                 | `Group` entity, `GroupResponse`                  |
| Group count  | Number of groups, equal to the number of months.                                                             | `Junta.groupCount` (column `groups`)             |
| Group amount | What each group collects per month: pool ÷ group count.                                                      | `Junta.groupAmount` (column `partial_amount`)    |
| Payout order | The month in which a group receives the pool. 1 = first month.                                               | `Group.order`                                    |
| Member       | A participant assigned to a group of a junta.                                                                | `ParticipantGroup` entity, `GroupMemberResponse` |
| Participant  | A person who can take part in juntas.                                                                        | `Participant` entity                             |
| Account      | A login for the web or mobile app. Always linked to one participant.                                         | `Account` entity                                 |
| Organizer    | An account that creates and runs juntas.                                                                     | `Role.ORGANIZER`, `Junta.organizerId`            |
| Contribution | A member's payment for one month.                                                                            | `Contribution` entity (no endpoints yet)         |
| Payout       | The pool paid to one group in one month.                                                                     | `Payout` entity (no endpoints yet)               |
| Distribution | One member's equal share of a payout.                                                                        | `Distribution` entity (no endpoints yet)         |
| Raffle       | The random draw that sets the initial payout order.                                                          | `shuffle()` in `libs/domain`                     |
| Active       | The junta is happening: today is the start date, the end date, or a day between them. Not a stored checkbox. | derived from the start and end dates             |

## Business rules

Status values: **enforced** means code rejects violations, **partial** means
only some paths enforce it, **planned** means the rule is agreed but not built.

| Id    | Rule                                                                                                                                                                                                                                                                                                                      | Status   | Where                                          |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------- |
| BR-01 | A junta has one group per calendar month from the start month to the end month, inclusive, and lasts at least two months.                                                                                                                                                                                                 | enforced | `junta-write.ts`, `junta-schedule.ts`          |
| BR-02 | Payout orders are 1 to n with no gaps or repeats. Order n receives the pool in month n.                                                                                                                                                                                                                                   | enforced | `group-assignments.ts`                         |
| BR-03 | Each group collects exactly pool ÷ group count every month, in whole units. A pool that does not divide evenly is rejected.                                                                                                                                                                                               | enforced | `junta-financials.ts`                          |
| BR-04 | Each member pays group amount ÷ members of their group every month.                                                                                                                                                                                                                                                       | planned  |                                                |
| BR-05 | A participant belongs to at most one group per junta.                                                                                                                                                                                                                                                                     | enforced | `group-assignments.ts`                         |
| BR-06 | In its month a group receives the full pool and splits it equally among its members.                                                                                                                                                                                                                                      | planned  |                                                |
| BR-07 | Every member pays every month until the junta ends, whether or not their group was already paid.                                                                                                                                                                                                                          | planned  |                                                |
| BR-08 | A raffle is a uniform shuffle of the groups. The draw is not weighted and is not stored. The organizer may change the junta, including its payout order, only before the start date.                                                                                                                                      | enforced | `raffle.ts` (shuffle), `junta-write.ts` (lock) |
| BR-09 | A participant may take part in several juntas at once. Each junta tracks money independently.                                                                                                                                                                                                                             | enforced | data model                                     |
| BR-10 | Money changes hands offline. The system only records it.                                                                                                                                                                                                                                                                  | enforced | by design                                      |
| BR-11 | Every account is linked to exactly one participant, created together.                                                                                                                                                                                                                                                     | enforced | `AccountsService.createAccount`                |
| BR-12 | Permissions derive from roles. An admin holds every permission; an organizer holds all but account management.                                                                                                                                                                                                            | enforced | `permissions.ts`, `PermissionsGuard`           |
| BR-13 | Each junta stores its currency as an ISO 4217 code. Its amounts are whole units of that currency.                                                                                                                                                                                                                         | enforced | `junta-financials.ts`, `CreateJuntaDto`        |
| BR-14 | Only admins and organizers can sign in to the web app. Participant-only accounts use the mobile app.                                                                                                                                                                                                                      | enforced | `permissions.ts`, `AuthService`                |
| BR-15 | A participant sees only the juntas they belong to and the names of their own group. Never phone numbers or other groups.                                                                                                                                                                                                  | enforced | `participant-visibility.ts`, `MeService`       |
| BR-16 | An organizer manages only their own juntas, and the participants they created or who belong to those juntas. Admins manage everything.                                                                                                                                                                                    | enforced | `permissions.ts`, `participant-scope.ts`       |
| BR-17 | On and after the start date the junta is locked, and the lock holds after the end date. Only an admin can change or delete it, and an admin's change may touch any field except setting the start date to today or earlier. No role can create a junta whose start date is today or earlier. The other rules still apply. | enforced | `junta-write.ts`, `JuntasService`              |

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
Scenario 7 is covered by `libs/domain/src/lib/junta-write.spec.ts`.

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
7. **A junta that has started.** The start date is today or earlier. An
   organizer's change or delete is refused (BR-17). An admin can change it,
   including moving the start date later, but cannot set the start date to
   today or earlier.

## Roles

| Role          | Can do                                                                                                               |
| ------------- | -------------------------------------------------------------------------------------------------------------------- |
| `admin`       | Everything, including managing accounts. A few system administrators, never created through the app.                 |
| `organizer`   | Create and run their own juntas and participants (BR-16). Generated resources grant their permissions to organizers. |
| `participant` | Every app user: read the juntas they belong to through `/api/me` (`self:read`, BR-15).                               |

The mapping is `ROLE_PERMISSIONS` in `libs/domain/src/lib/permissions.ts`.
The admin app is the owner's back office. Participants will use a mobile app,
see [spec 003](specs/003-participant-mobile-app.md).

## Data model

The TypeORM entities in `apps/api/src/app/**/entities/` define the schema, and
the migrations in `apps/api/src/app/database/migrations/` apply it (ADR 0005).
Tables keep their historical names, for example `ParticipantsGroups`.

- `Accounts` hold every login. Each links to one `Participants` row (BR-11).
- `Juntas` belong to their organizer's `Accounts` row and own many `Groups`.
- `ParticipantsGroups` links `Participants` to `Groups`. It is the membership
  table.
- `Contributions`, `Payouts` and `Distributions` reference the junta, the group
  or payout and the participant. They exist in the schema without endpoints.

## Decisions

Answers from the product owner. Each one closes an open question or changes a
rule above.

| Date       | Decision                                                                                                                                                                      | Closes             |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| 2026-10-18 | Amounts are whole currency units and never carry cents. BR-03 keeps flooring.                                                                                                 | Q-01               |
| 2026-10-18 | Currency and number formatting follow the market. Whether that is per junta or per market is Q-02.                                                                            | Q-02 in part       |
| 2026-10-18 | The `Payments` and `Receipts` tables are dropped, by migration `DropLegacyTables`.                                                                                            | Q-09               |
| 2026-10-18 | Admins hold the permissions of every generated resource.                                                                                                                      | BR-12              |
| 2026-10-18 | Logging out ends every session of that admin.                                                                                                                                 | spec 002           |
| 2026-10-18 | Schema changes go through migrations, starting now.                                                                                                                           | ADR 0005           |
| 2026-10-18 | Payment amount columns became whole-unit integers (migration `WholeUnitPaymentAmounts`).                                                                                      | Q-01               |
| 2026-10-18 | Each junta stores its own currency (BR-13). Existing juntas got MXN.                                                                                                          | Q-02               |
| 2026-10-18 | A pool must split evenly across its groups; uneven pools are rejected (BR-03).                                                                                                | Q-13               |
| 2026-10-18 | The participant role cannot be an admin account's only role (BR-14). Replaced by spec 004.                                                                                    | Q-14               |
| 2026-10-18 | `superAdmin` became `admin` and the old `admin` became `organizer`; one Accounts table (spec 004).                                                                            | BR-12, BR-16       |
| 2026-10-19 | A junta lasts at least two months. The server rejects a shorter one.                                                                                                          | Q-08               |
| 2026-10-19 | The server rejects a group count that differs from the inclusive month span.                                                                                                  | Q-03, BR-01        |
| 2026-10-19 | The raffle is a uniform shuffle. It is not weighted and the draw is not stored.                                                                                               | Q-04               |
| 2026-10-19 | The organizer may change a junta only before its start date. On and after that date only an admin can change it.                                                              | Q-06, BR-08, BR-17 |
| 2026-10-19 | Start and end are calendar dates with no time of day. The month span is counted from those dates.                                                                             | BR-01              |
| 2026-10-19 | The active checkbox does not mean the junta has started. Active means the junta is happening.                                                                                 |                    |
| 2026-10-19 | The lock holds after the end date. An admin can change any field of a locked junta, and the other rules still apply.                                                          | BR-17              |
| 2026-10-19 | The active checkbox and its column go away. Active is derived from the start and end dates.                                                                                   |                    |
| 2026-10-19 | An organizer cannot create a junta whose start date is today or earlier.                                                                                                      | BR-17              |
| 2026-10-19 | Existing start and end timestamps become their UTC calendar dates. The active column is dropped.                                                                              | BR-01              |
| 2026-10-19 | The lock and the Active derivation use today's UTC date.                                                                                                                      | BR-17              |
| 2026-10-19 | An organizer cannot delete a junta on or after its start date. An admin can.                                                                                                  | BR-17              |
| 2026-10-19 | The form and the server call one domain module for the junta write checks. The raffle stays a shuffle in the form.                                                            | BR-01, BR-08       |
| 2026-10-19 | An organizer who changes or deletes a started junta gets a 400 with rule BR-17. A junta they do not own stays a 404.                                                          | BR-17              |
| 2026-10-19 | An organizer's create or edit must leave the start date after today. It cannot be today or in the past.                                                                       | BR-17              |
| 2026-10-19 | No role can create a junta with a start date of today or earlier, or change a start date to such a day. An admin may edit a started junta and leave its start date unchanged. | BR-17              |

## Open questions

Answer these with the product owner before building the related features.

| Id   | Question                                                                                                           | Current behavior                                       |
| ---- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| Q-05 | What happens when a participant leaves mid-cycle?                                                                  | Not handled.                                           |
| Q-07 | How are partial payments recorded?                                                                                 | Not handled.                                           |
| Q-10 | Are contributions created with the junta or month by month? What happens to them when groups are edited?           | No contributions are created. See spec 001.            |
| Q-11 | Who marks a contribution as paid, and under which permission?                                                      | No endpoint. See spec 001.                             |
| Q-12 | Does `overdue` follow a date rule, such as unpaid after day N of the month, or is it set by hand?                  | No endpoint. See spec 001.                             |
| Q-15 | How does a group's monthly amount split among its members when it does not divide evenly (BR-04)?                  | The app shows the group's monthly amount and its size. |
| Q-16 | Should a self-registered account be linked to an existing participant the owner created, and how is that verified? | Every account creates a new participant.               |
