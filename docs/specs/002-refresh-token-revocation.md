# 002: Refresh token revocation

- **Status:** draft
- **Owner:** unassigned
- **Rules:** none (security, not a business rule)

## Problem

The API cannot revoke refresh tokens. Logout only clears the cookie in the
browser that logs out, and changing an admin's password invalidates nothing.
Every refresh issues a new 7-day refresh token, so a stolen refresh cookie
keeps a session alive until the admin is deleted.

## Decisions

None taken yet. See the open questions.

## Scope

- In: revoke every refresh token of an admin on logout and on password change.
- Out: listing or revoking individual sessions, refresh token rotation with
  reuse detection. Both can follow later.

## Contract changes (`libs/contracts`)

None. Token payloads are internal to `apps/api` (`auth/auth.types.ts`).

## API changes (`apps/api`)

| Method | Path                | Permission | Request        | Response | Errors |
| ------ | ------------------- | ---------- | -------------- | -------- | ------ |
| POST   | `/api/auth/refresh` | public     | refresh cookie | 200      | 401    |
| POST   | `/api/auth/logout`  | public     | refresh cookie | 204      | none   |

- `refresh` rejects a token whose `ver` claim differs from the admin's stored
  `tokenVersion`.
- `logout` still clears the cookie. When the cookie holds a valid refresh
  token, it also increments that admin's `tokenVersion`. An invalid or missing
  cookie is not an error, because logout must always succeed.
- `AdminsService.update` increments `tokenVersion` when the request changes
  the password.

Entity changes: `Admin.tokenVersion`, column `token_version`, `int`, not null,
default `0`, on the `Administrators` table. Development syncs it
automatically. Production needs a migration, see
[ADR 0003](../decisions/0003-entities-are-the-schema.md).

## Admin changes (`apps/admin`)

None. The admin already calls logout and ends the session when a refresh
answers 401.

## Generator commands

None. The feature changes existing auth code only.

## Acceptance criteria

- [ ] After logout, the old refresh cookie gets 401 from `/api/auth/refresh`
      (e2e).
- [ ] After a password change, every refresh token issued before it gets 401
      (e2e).
- [ ] Refresh tokens issued before the deploy have no `ver` claim. They count
      as version 0, so the deploy logs nobody out (unit test).
- [ ] Logout with a missing, expired or forged cookie still answers 204 (e2e).

## Test plan

- `apps/api`: unit tests in `auth/auth.service.spec.ts` and
  `admins/admins.service.spec.ts`, e2e in `test/auth.e2e-spec.ts`.

## Open questions

- Should logout end every session of the admin, which this design does, or
  only the current browser's? Per-browser logout needs a sessions table.
- Is the new column acceptable before migrations exist for production?
