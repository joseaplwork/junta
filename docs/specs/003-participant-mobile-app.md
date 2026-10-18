# 003: Participant mobile app

- **Status:** draft
- **Owner:** unassigned
- **Rules:** BR-04, BR-06, BR-07, BR-09, BR-12, and a new BR-13 below

## Problem

Participants cannot see their juntas, their payout month or what they owe.
They ask the owner. The owner wants an app for them on the App Store and
Google Play and keeps the admin app as the back office. The app shell exists
in `apps/mobile` and shows only whether it can reach the API.

## Decisions

- Hybrid app with Ionic and Capacitor ([ADR 0006](../decisions/0006-hybrid-mobile-app.md)),
  proposed and waiting for the owner's confirmation.
- Money changes hands offline (BR-10), so the app takes no payments.

## Scope

Proposed for the first release, read-only:

- In: sign in; list my juntas; one junta's detail with its amount and
  schedule, my group and payout month, my group's members by name, and what I
  pay each month (BR-04).
- Out: paying or marking payments (spec 001 first), editing anything,
  messaging, push notifications.

## Contract changes (`libs/contracts`)

```ts
// Sketch. Final names come with the answers below.
interface MyJuntaSummaryResponse {
  id: string
  name: string
  amount: number
  startDate: string
  endDate: string
  payoutMonth: number // order of my group (BR-02)
  monthlyPayment: number // BR-04
}
interface MyJuntaDetailResponse extends MyJuntaSummaryResponse {
  groupMembers: { name: string; surname: string }[]
}
```

## API changes (`apps/api`)

| Method | Path                 | Permission  | Request | Response                   | Errors   |
| ------ | -------------------- | ----------- | ------- | -------------------------- | -------- |
| GET    | `/api/me/juntas`     | `self:read` | none    | `MyJuntaSummaryResponse[]` | 401, 403 |
| GET    | `/api/me/juntas/:id` | `self:read` | none    | `MyJuntaDetailResponse`    | 401, 404 |

- **New rule BR-13:** a participant sees only the juntas they belong to and the
  names of their own group's members. Never phone numbers, never other groups.
  It goes into `docs/domain.md` before any code.
- **Required before anyone signs in:** the `participant` role must lose
  `junta:read` and `participant:read`. With them, a participant could read
  every junta and every phone number through the admin endpoints. The new
  `self:read` permission replaces them.
- **Sign-in:** participants have no credentials today, only a phone number.
  The answer to question 1 decides the endpoints and the data model.
- **Tokens on a phone:** the admin keeps its refresh token in a cookie, which
  a native web view handles poorly. The mobile app should receive the refresh
  token in the response body and keep it in the iOS Keychain or Android
  Keystore through a secure-storage plugin. Revocation reuses spec 002.

## Admin changes (`apps/admin`)

Depends on question 2: an invite action on the participant page and a column
showing who has an account.

## Mobile changes (`apps/mobile`)

Pages: sign-in, my juntas, junta detail. Native projects get added once the
app id is known (question 5).

## Generator commands

None. The `me` endpoints are scoped reads, not CRUD resources.

## Acceptance criteria

Written once the open questions are answered. At minimum:

- [ ] A participant token cannot call any admin endpoint (e2e).
- [ ] A participant sees only their own juntas and their group's names (e2e).

## Test plan

- `libs/domain`: BR-13 visibility rules.
- `apps/api`: unit and e2e tests for the `me` endpoints and participant
  sign-in, including the permission checks above.
- `apps/mobile`: component tests for each page.

## Open questions

1. How do participants sign in: phone number with an SMS code, email and
   password, an invite code from you followed by a password, or Sign in with
   Apple or Google?
2. Do participants register themselves, or only claim an account you create
   for them?
3. Is the first release read-only as scoped above, or should participants also
   report payments, which needs spec 001?
4. Do you want push notifications, such as payment reminders and payout
   alerts, in the first release?
5. What are the app name and app id? The id is a reverse domain you own, such
   as `com.yourdomain.junta`. Who will hold the Apple and Google developer
   accounts?
6. Which languages at launch? This ties to Q-02, the currency per market.
7. Where will the API run in production? Its URL goes into
   `apps/mobile/src/environments/environment.ts`.
