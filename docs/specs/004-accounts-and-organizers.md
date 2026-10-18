# 004: Accounts, admins and organizers

- **Status:** done
- **Owner:** joseaplwork
- **Rules:** BR-11, BR-12, BR-14, BR-16 (new)

## Problem

App users who sign up can either just take part in juntas or also run their
own. Running juntas used the `admin` role, which also let them see every
junta and every participant. `superAdmin` only existed because `admin` was
taken. People with a web login and people with an app login lived in two
tables, although one person can be both.

## Decisions

Owner, 2026-10-18:

- `superAdmin` becomes `admin`: the few system administrators, never created
  through the app.
- The old `admin` becomes `organizer`: someone who creates and runs juntas.
- `participant` stays: every app user, who sees the juntas they belong to.

Defaults taken while building, to confirm:

- Admins grant the organizer role from the web app. Self-serve comes later.
- Organizers work in the web app until mobile organizer screens are specced.
- Organizers add participants they create themselves. Adding existing app
  users (by email or invite) is a follow-up.

## Design

| Role          | Permissions                                                   | Scope                                                  |
| ------------- | ------------------------------------------------------------- | ------------------------------------------------------ |
| `admin`       | every permission                                              | everything                                             |
| `organizer`   | junta and participant create, read, update, delete; self:read | their own juntas; participants they created or in them |
| `participant` | self:read                                                     | juntas they belong to, through `/api/me` (BR-15)       |

- One `Accounts` table replaces `Administrators` and `ParticipantAccounts`.
  Every account is linked to one participant (BR-11) and holds a list of
  roles. Signing up in the app creates a participant-only account.
- The web app accepts only accounts with the `admin` or `organizer` role
  (BR-14). The mobile app accepts every account.
- **BR-16:** an organizer manages only juntas whose `organizer_id` is theirs,
  and participants they created or who belong to one of their juntas. Others
  answer 404. Admins manage everything.
- Permissions `admin:*` become `account:*`, for managing accounts. Generated
  resources grant their permissions to organizers.

## Contract changes (`libs/contracts`)

- `Role`: `ADMIN = 'admin'`, `ORGANIZER = 'organizer'`, `PARTICIPANT`.
- `Permission`: `ACCOUNT_CREATE/READ/UPDATE/DELETE` replace `ADMIN_*`.
- `account.ts` replaces `admin.ts`: `AccountResponse`,
  `CreateAccountRequest`, `UpdateAccountRequest`.
- `ApiResource.accounts` replaces `admins`; `ApiResource.mobileAuth`
  (`mobile-auth`) replaces `participantAuth`.
- `JuntaResponse.organizerId` replaces `adminId`.

## Database changes

One migration, `AccountsAndOrganizers`:

- Stored roles: `admin` becomes `organizer`, then `superAdmin` becomes `admin`.
- `Administrators` is renamed to `Accounts`; app accounts move into it with
  the `participant` role; `ParticipantAccounts` is dropped.
- `Juntas.admin_id` becomes `organizer_id`.
- `Participants.created_by` records the account that created a participant.
  Existing participants have none, so only admins and the organizers of their
  juntas see them.

## Acceptance criteria

- [x] Existing logins keep working with their mapped roles (migration on the
      development database, then sign-in).
- [x] An organizer sees only their own juntas and participants; another
      organizer's junta answers 404 (e2e).
- [x] A participant-only account cannot sign in to the web app, and can sign
      in to the mobile app (e2e).
- [x] Only admins manage accounts (e2e).

## Open questions

The defaults above.
