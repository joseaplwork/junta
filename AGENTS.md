# Junta: instructions for AI agents

Junta manages _juntas_, rotating savings groups. In the web app (`apps/admin`)
admins and organizers create juntas, assign participants to monthly payout
groups and record the money that changes hands offline. In the mobile app,
every account sees the juntas it belongs to. Roles are `admin`, `organizer`
and `participant` (spec 004). Business rules live in
[docs/domain.md](docs/domain.md). Read it before you touch anything involving
money, groups or roles.

This file is the canonical agent guide for every tool. `CLAUDE.md` imports it,
and Cursor reads it directly. The app folders add their own `AGENTS.md`.

## Agent skills

### Issue tracker

Issues live as GitHub issues in `joseaplwork/junta`. Use the GitHub MCP server.
See `docs/agents/issue-tracker.md`.

### Triage labels

Five default roles: `needs-triage`, `needs-info`, `ready-for-agent`,
`ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context. Domain language is `docs/domain.md`; ADRs are
`docs/decisions/`. See `docs/agents/domain.md`.

## Commands

| Goal                                    | Command                                                                                                       |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Install                                 | `npm ci` (Node 22 or 24; CI uses `.nvmrc`)                                                                    |
| Run the API (needs `apps/api/.env`)     | `npm run start:api`                                                                                           |
| Run the admin app                       | `npm run start:admin`                                                                                         |
| Run the mobile app (Expo dev server)    | `npm run start:mobile`                                                                                        |
| New resource, backend and admin page    | `npx nx g @junta/nx-plugin:crud <name> --fields="<spec>" --no-interactive`                                    |
| New backend resource only               | `npx nx g @junta/nx-plugin:api-resource <name> --fields="<spec>" --no-interactive`                            |
| New mobile screen                       | `npx nx g @junta/nx-plugin:mobile-screen <name> [--protected] --no-interactive` (see `apps/mobile/AGENTS.md`) |
| Apply database migrations               | `npx nx run @junta/api:migration-run`                                                                         |
| Migration after an entity change        | `npx nx run @junta/api:migration-generate --name=<WhatChanged>`                                               |
| Verify affected projects (done = green) | `npm run verify`                                                                                              |
| API end-to-end tests (needs Postgres)   | `npm run verify:e2e`                                                                                          |
| Format changed files                    | `npm run format`                                                                                              |
| One target of one project               | `npx nx <target> <project>`, e.g. `npx nx test @junta/domain`                                                 |

Field specs look like `title:string,amount:int,dueDate?:date`. Types are
`string`, `int`, `decimal`, `boolean` and `date`. `?` marks an optional field.

Always run tasks through Nx, never through `jest`, `eslint` or `tsc` directly.
Inspect projects and generators with the Nx MCP server when it is available.

## Workflow

1. **Specify.** Anything beyond a small fix starts as a spec in `docs/specs/`
   (skill: `write-spec`). Ask the user about open business questions first.
2. **Generate.** New resources and mobile screens come from the generators.
   Never copy a feature or screen folder by hand.
3. **Implement.** Follow the `AGENTS.md` of the app you are in. Business rules
   go in `libs/domain` with tests named after their rule id.
4. **Verify.** `npm run verify` must pass. If the API changed, also run
   `npm run verify:e2e`. The agent stop hook re-checks your work automatically.
5. **Report.** Say what changed, how you verified it and what is still open.

## Where code goes

| Path                 | Contains                                                                     | May import        |
| -------------------- | ---------------------------------------------------------------------------- | ----------------- |
| `apps/api`           | NestJS + TypeORM REST API. See `apps/api/AGENTS.md`.                         | contracts, domain |
| `apps/admin`         | Angular 20 admin app, zoneless and signal-based. See `apps/admin/AGENTS.md`. | contracts, domain |
| `apps/mobile`        | React Native + Expo app for participants. See `apps/mobile/AGENTS.md`.       | contracts, domain |
| `libs/contracts`     | API request and response types, enums, route names. Types only.              | nothing           |
| `libs/domain`        | Pure business rules with tests, tagged with `BR-xx` ids.                     | contracts         |
| `tools/nx-plugin`    | The code generators and their templates.                                     | tooling only      |
| `tools/eslint-rules` | Custom lint rules for this repo.                                             | tooling only      |
| `tools/scripts`      | `verify.mjs`, the single definition of "verified".                           |                   |
| `tools/ai/hooks`     | Format-on-edit and verify-on-stop hooks shared by Claude Code and Cursor.    |                   |
| `docs`               | Domain, architecture, workflow, specs and decision records.                  |                   |

## Hard rules

Each rule names what enforces it. Never weaken an enforcer to get green.

1. **Contracts first.** Every API shape is defined once in `libs/contracts`.
   DTOs `implements` it and every app's clients return it. [typecheck]
2. **Shared libraries stay pure.** `libs/contracts` imports nothing.
   `libs/domain` imports only contracts and no framework. [lint: module boundaries]
3. **Apps never import each other.** Rules and API shapes that several apps
   need go in `libs/domain` and `libs/contracts`. Each app keeps its own HTTP,
   auth and layout code. [lint: module boundaries]
4. **Business rules live in `libs/domain`** as pure functions with tests.
   Controllers hold no logic and cannot import repositories or domain code.
   [lint: no-restricted-imports]
5. **Every API route needs a valid token and a permission** unless it is
   marked `@Public()`. [global guards]
6. **Pages are independent.** An admin page or a mobile screen never imports
   another one. [lint: @nx/workspace-no-cross-page-imports]
7. **Pages talk to the API only through their app's `shared/api` clients.**
   [lint: no-restricted-imports in the admin, no-restricted-globals in mobile]
8. **Framework style.** Admin: standalone, OnPush, `input()`, `output()`,
   `signal()`, `inject()`, built-in control flow, `ja-` selectors. Mobile:
   function components with explicit return types and the rules of hooks.
   [lint]
9. **TypeScript is strict.** No `any`. Exported functions declare return types.
   Promises are awaited or explicitly `void`. [typecheck, lint]
10. **Entities define the schema and migrations change it.** Every entity
    change ships with a migration from `migration-generate`. Never edit a
    migration that has already run; add a new one. [e2e: migrations build the
    entity schema, ADR 0005]
11. **Secrets stay in `apps/api/.env`**, which is git-ignored. Never read,
    print or commit it. [Claude Code permissions]

## Definition of done

- `npm run verify` passes.
- API changes have an e2e test, and `npm run verify:e2e` passes.
- Entity changes ship with their generated migration.
- Business rule changes update `docs/domain.md` and a `libs/domain` test with
  the rule id.
- A new convention or architectural choice gets an ADR in `docs/decisions/`.
- No `TODO` without a spec or issue reference.

## Ask before you decide

Stop and ask the user when a task depends on rounding or currency, roles and
permissions, deleting data, anything published to the app stores, or any open
question in `docs/domain.md`. Write the answer into that file or the spec.

## Troubleshooting

- `No cached ProjectGraph is available` means another Nx process, such as the
  editor, rewrote the graph cache mid-run. `npm run verify` avoids it. For
  other Nx commands, run them again.
- A generator refuses to overwrite existing code. Pick another name or edit
  the existing resource by hand, following its current shape.
