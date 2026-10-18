# 0007: One accounts table; admin, organizer and participant roles

- **Status:** accepted by the owner on 2026-10-18
- **Date:** 2026-10-18

## Context

App users can take part in juntas and some also run their own. Running juntas
used the `admin` role, which could see every junta and phone number, and
`superAdmin` existed only because `admin` was taken. Web and app logins lived
in two tables although one person can be both.

## Decision

- Roles: `admin` (the few system administrators, formerly `superAdmin`),
  `organizer` (runs their own juntas, formerly `admin`) and `participant`
  (every app user).
- One `Accounts` table for every login, each linked to one participant
  (BR-11). The migration `AccountsAndOrganizers` renamed `Administrators`,
  moved the app accounts in and mapped the stored roles.
- Organizers are scoped (BR-16): services take the caller as `viewer` and
  answer 404 for other organizers' juntas and participants.
- The web app accepts admins and organizers (BR-14); the mobile app accepts
  every account.
- Permissions `admin:*` became `account:*`. Generated resources grant their
  permissions to organizers.

## Consequences

- Organizers can be given web access without seeing other organizers' data.
- Generated resources are shared across organizers until their spec adds an
  organizer column and scoping.
- Admins grant the organizer role for now; self-serve organizers and adding
  existing app users to juntas by email are follow-ups (spec 004).
