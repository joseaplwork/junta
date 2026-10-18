# Junta

Software for _juntas_, rotating savings groups. The owner runs them from an
admin app: creating juntas, assigning participants to monthly payout groups
and recording contributions and payouts. A mobile app for participants is
under way. The domain is described in [docs/domain.md](docs/domain.md).

- **API**: NestJS 10, TypeORM, PostgreSQL (`apps/api`)
- **Admin**: Angular 20, zoneless, signals, Angular Material and Tailwind
  (`apps/admin`)
- **Mobile**: Angular 20 with Ionic 9, packaged for iOS and Android by
  Capacitor 8 (`apps/mobile`)
- **Shared**: `@junta/contracts` (API types) and `@junta/domain` (business
  rules)
- **Tooling**: Nx 21, Jest, ESLint, Prettier, custom generators in
  `tools/nx-plugin`

The repository is built to be developed mostly by AI agents (Claude Code and
Cursor) under human review. Start with [AGENTS.md](AGENTS.md) and
[docs/workflow.md](docs/workflow.md).

## Setup

1. Node 22 (`nvm use`) or Node 24, and PostgreSQL running locally.
2. `npm ci`
3. `cp apps/api/.env.example apps/api/.env` and fill in the database
   credentials and a random `JWT_SECRET`.
4. `npx nx run @junta/api:migration-run` creates or updates the schema. The
   API refuses to start while migrations are pending.
5. `npm run start:api` (http://localhost:3000/api),
   `npm run start:admin` (http://localhost:4200) and
   `npm run start:mobile` (http://localhost:4300).
6. Native mobile builds also need Xcode for iOS and the Android SDK for
   Android. See [apps/mobile/AGENTS.md](apps/mobile/AGENTS.md).

## Everyday commands

| Command                                                                        | What it does                                                         |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| `npm run verify`                                                               | Format check, lint, typecheck, tests and builds of affected projects |
| `npm run verify:all`                                                           | The same for every project                                           |
| `npm run verify:e2e`                                                           | API end-to-end tests against the `E2E_DB_NAME` database              |
| `npm run format`                                                               | Prettier on changed files                                            |
| `npx nx g @junta/nx-plugin:crud <name> --fields="title:string,amount:decimal"` | New resource: API, contracts, admin page and tests                   |
| `npx nx run @junta/api:migration-run`                                          | Apply pending database migrations                                    |
| `npx nx run @junta/api:migration-generate --name=<Name>`                       | Write a migration from entity changes                                |
| `npx nx graph`                                                                 | Project dependency graph                                             |

## Repository map

| Path                 | Purpose                                                                    |
| -------------------- | -------------------------------------------------------------------------- |
| `apps/api`           | REST API ([conventions](apps/api/AGENTS.md))                               |
| `apps/admin`         | Admin web app ([conventions](apps/admin/AGENTS.md))                        |
| `apps/mobile`        | Participant app for iOS and Android ([conventions](apps/mobile/AGENTS.md)) |
| `libs/contracts`     | Request and response types shared by every app                             |
| `libs/domain`        | Business rules with tests                                                  |
| `tools/nx-plugin`    | Code generators                                                            |
| `tools/eslint-rules` | Repository-specific lint rules                                             |
| `tools/scripts`      | `verify.mjs`, `migrations.mjs` and the Node version check                  |
| `tools/ai/hooks`     | Format-on-edit and verify-on-stop hooks for Claude Code and Cursor         |
| `docs`               | [Domain, architecture, workflow, specs, decisions](docs/README.md)         |
