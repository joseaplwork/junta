# 003: Participant mobile app

- **Status:** done
- **Owner:** joseaplwork
- **Rules:** BR-02, BR-03, BR-12, BR-13, BR-15 (new)

> Spec 004 later merged participant accounts into the `Accounts` table and
> renamed `/api/participant-auth` to `/api/mobile-auth`.

## Problem

Participants cannot see their juntas, their payout month or what their group
pays. They ask the owner. The owner wants a React Native app for them on the
App Store and Google Play; the admin app stays the owner's back office.

## Decisions

Owner answers from 2026-10-18:

- React Native with Expo ([ADR 0006](../decisions/0006-react-native-mobile-app.md)).
- Participants sign in with email and password.
- Participants create their own accounts.
- The mobile app is what ships to the stores. No push notifications for now.
- The app is in Spanish and built to add more languages.
- The owner (joseaplwork) holds the developer accounts. The API runs locally
  for now, so there is no production URL yet.

Assumptions taken while building, to confirm with the owner:

- A self-registered account creates a new participant. It is never matched to
  an existing participant by phone number, because nothing verifies the
  phone: matching would let anyone claim someone else's juntas. The owner adds
  new participants to juntas from the admin app. Q-16 asks whether to link
  accounts to existing participants, and how.
- The first release is read-only.
- How a group's monthly amount splits among its members is not decided
  (Q-15), so the app shows the group's monthly amount and its size.

## Scope

- In: register, sign in and sign out; list my juntas; one junta's detail with
  amount, currency, schedule, my payout month, my group's monthly amount and
  its members' names.
- Out: payments, editing, notifications, password reset, email verification.

## Contract changes (`libs/contracts`)

- `participant-auth.ts`: `ParticipantRegisterRequest` (email, password, name,
  surname, phoneNumber), `ParticipantLoginRequest`, `ParticipantTokensResponse`
  (accessToken, refreshToken), `RefreshTokenRequest`.
- `me.ts`: `MyJuntaSummaryResponse` (junta fields, `payoutOrder`,
  `payoutDate`, `groupAmount`, `groupSize`) and `MyJuntaDetailResponse` (adds
  `groupCount` and `groupMembers` with names only).
- `Permission.SELF_READ = 'self:read'`; `ApiResource.participantAuth` and
  `ApiResource.me`; `AccessTokenClaims.participantId` for participant tokens.

## API changes (`apps/api`)

| Method | Path                        | Permission  | Request                      | Response                    | Errors             |
| ------ | --------------------------- | ----------- | ---------------------------- | --------------------------- | ------------------ |
| POST   | `/api/mobile-auth/register` | public      | `ParticipantRegisterRequest` | `ParticipantTokensResponse` | 400, 409           |
| POST   | `/api/mobile-auth/login`    | public      | `ParticipantLoginRequest`    | `ParticipantTokensResponse` | 401                |
| POST   | `/api/mobile-auth/refresh`  | public      | `RefreshTokenRequest`        | `ParticipantTokensResponse` | 401                |
| POST   | `/api/mobile-auth/logout`   | public      | `RefreshTokenRequest`        | 204                         | none               |
| GET    | `/api/me/juntas`            | `self:read` | none                         | `MyJuntaSummaryResponse[]`  | 401, 403           |
| GET    | `/api/me/juntas/:id`        | `self:read` | none                         | `MyJuntaDetailResponse`     | 400, 401, 403, 404 |

- Tokens travel in the request and response body, never in cookies, and the
  app keeps them in the device keychain through `expo-secure-store`.
- Participant tokens carry `participantId`. Refresh tokens carry
  `kind: 'participant'` and the account's `tokenVersion`; logout ends every
  session of the account (spec 002).
- The `participant` role holds only `self:read`. It loses `junta:read` and
  `participant:read`.
- **BR-15:** a participant sees only juntas they belong to and the names of
  their own group's members. Never phone numbers, never other groups.

Entity changes: new table `ParticipantAccounts` (`id`, `email` unique,
`password` hash, `token_version`, `participant_id` unique foreign key,
`created_at`).

## Admin changes (`apps/admin`)

None. Self-registered participants appear in the participant list, where the
owner adds them to juntas.

## Mobile changes (`apps/mobile`)

Screens: sign-in, register, my juntas, junta detail. Spanish strings through
i18next with an English fallback, chosen from the device language.

## Generator commands

None. The endpoints are scoped reads and auth, not CRUD resources.

## Acceptance criteria

- [x] A participant registers and receives tokens; a duplicate email gets 409
      (e2e).
- [x] A participant token gets 403 on `/api/participants` and `/api/juntas`
      (e2e).
- [x] A participant sees only their own juntas and their own group's names,
      and gets 404 for a junta they are not in (e2e).
- [x] Logout revokes the refresh token; an admin refresh token is refused by
      the participant refresh endpoint and the reverse (e2e).
- [x] The mobile app registers, signs in, lists juntas and shows a detail
      (component tests, plus a manual run in the simulator).

## Test plan

- `libs/domain`: BR-02 payout dates, BR-15 visibility.
- `apps/api`: unit tests for the auth and me services; e2e for every endpoint.
- `apps/mobile`: component tests for each screen and the session handling.

## Open questions

See Q-15 and Q-16 in `docs/domain.md`. Neither blocks the first release.
