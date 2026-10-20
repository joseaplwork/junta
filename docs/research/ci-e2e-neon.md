# How CI and e2e talk to Neon

Research for [How CI and e2e talk to Neon](https://github.com/joseaplwork/junta/issues/21). This file records what has to change for this repo's CI and e2e to use Neon instead of a local Postgres 16 service. It does not choose project/branch layout, rewrite the workflow, or change application code.

Prior research: [What Neon requires of a deployed TypeORM Postgres](https://github.com/joseaplwork/junta/issues/18) / `docs/research/neon-typeorm-requirements.md` on branch `research/neon-typeorm-requirements`. Facts reused here: SSL is required; TypeORM migrations need the direct endpoint; the name `postgres` is reserved for create; `neon_superuser` members can `CREATE DATABASE`; a long-running Node process stays on node-postgres.

## What CI and e2e do today

`.github/workflows/ci.yml` has three jobs. `verify` needs no database. `api-e2e` and `generators` each start a `postgres:16` GitHub Actions service with user/password `postgres`, database `juntas`, and health checks on `pg_isready`. Both jobs set `DB_HOST=localhost`, `DB_PORT=5432`, `DB_USERNAME` / `DB_PASSWORD` / `DB_NAME`, `E2E_DB_NAME=juntas_e2e`, and `JWT_SECRET`.

`api-e2e` runs `migration-run`, then `migration-check`, then `npm run verify:e2e`. `generators` runs the CRUD and mobile-screen generators, then `migration-run`, `migration-generate`, lint/typecheck/test/build on the affected projects, and `verify:e2e`.

`apps/api/test/support/e2e-app.ts` loads app config but forces `database.name` to `E2E_DB_NAME` (default `juntas_e2e`, must end in `_e2e`). Before boot it opens a separate TypeORM `DataSource` to database `postgres` (hardcoded), and `CREATE DATABASE` for the e2e name if missing. After Nest boots on that e2e database it calls `dataSource.dropDatabase()`, `runMigrations({ transaction: 'each' })`, asserts entities match migrations, and seeds one admin.

TypeORM 0.3's `DataSource.dropDatabase()` for Postgres does **not** issue `DROP DATABASE`. It calls `clearDatabase()`, which drops views, materialized views, tables, and enum types in the connected schemas. The database name stays. The `_e2e` suffix and the comment that "the suite drops it" refer to wiping schema objects inside that database, not deleting the database catalog entry. The only `CREATE DATABASE` is in `ensureDatabaseExists`. Nothing in the suite runs `DROP DATABASE juntas_e2e`.

`databaseOptions` still sets no `ssl`. Migration CLI targets use the same options (`apps/api/src/app/database/data-source.ts`, `tools/scripts/migrations.mjs`).

Sources (this repo):

- `.github/workflows/ci.yml`
- `apps/api/test/support/e2e-app.ts`
- `apps/api/src/app/database/database-options.ts`
- TypeORM 0.3.20 `DataSource.dropDatabase` / `PostgresQueryRunner.clearDatabase` ([jsDelivr](https://cdn.jsdelivr.net/npm/typeorm@0.3.20/data-source/DataSource.js), [PostgresQueryRunner](https://cdn.jsdelivr.net/npm/typeorm@0.3.20/driver/postgres/PostgresQueryRunner.js))

## Maintenance connection named `postgres`

It cannot stay as written.

Neon reserves the names `postgres`, `template0`, and `template1`: you cannot create a database with those names. The glossary also states that users cannot manipulate system databases such as `postgres`, `template0`, and `template1`. A new Neon project gets a user database named `neondb` by default (unless you choose another name), not a writable maintenance database named `postgres`.

Neon's own SQL guidance for rename and drop says to connect to a **different user database on the same branch** first, and gives `neondb` as the example — not `postgres`.

So `ensureDatabaseExists` must open its maintenance `DataSource` against a real user database on the branch (typically `neondb`, or whatever `DB_NAME` already is), with SSL and the Neon hostname. Connecting to `postgres` as today is not the Neon-supported pattern and is not something Neon documents as available for application use.

`CREATE DATABASE` itself remains allowed for `neon_superuser` members (Console/CLI/API roles), including `juntas_e2e`, as long as the name is not reserved and the owner is not the `neon_superuser` role itself. That does not rescue the hardcoded maintenance database name.

Sources:

- [Manage databases](https://neon.com/docs/manage/databases) (reserved names; SQL create/drop; connect to another database such as `neondb` for rename/drop)
- [Glossary: Database](https://neon.com/docs/reference/glossary) (default `neondb`; users cannot manipulate system databases `postgres` / `template0` / `template1`)
- [Manage roles](https://neon.com/docs/manage/roles) / prior issue 18 notes (`CREATEDB` via `neon_superuser` membership)

## Create/drop `juntas_e2e` every run, or Neon's CI pattern

### What this suite actually needs

Per run it needs an isolated Postgres catalog it can wipe and rebuild from migrations. Today that isolation is a second database name (`juntas_e2e`) created once via `CREATE DATABASE`, then wiped with TypeORM `clearDatabase` (via `dropDatabase()`), then migrated. Concurrent `api-e2e` and `generators` jobs both use the same `E2E_DB_NAME` against separate Docker services today, so they never share state. On one shared Neon endpoint they would race.

### Is create-then-wipe of `juntas_e2e` viable on Neon?

Technically, yes, with caveats:

1. Maintenance connection must target a user database (`neondb` or similar), not `postgres`.
2. Role must be a `neon_superuser` member (project owner / Console role).
3. SSL and a Neon hostname are required on every connection, including the maintenance one.
4. After create, TypeORM `dropDatabase()` only clears schema objects; it does not need `DROP DATABASE`. Leaving `juntas_e2e` on the branch between runs is fine for a **dedicated** CI database that one job owns at a time.
5. Parallel jobs must not share the same branch database: either serialize them, give each job its own database name, or (preferred by Neon) give each job its own branch.

Neon does **not** document "CREATE DATABASE and DROP DATABASE on every CI run" as the CI pattern. Limits are 500 databases per branch; create/delete are permanent catalog operations, not the cheap copy-on-write path.

### What Neon documents instead

**One ephemeral Neon branch per test run (or per pipeline):**

1. Create a branch at the start of the job (GitHub Action `neondatabase/create-branch-action`, typically named with `github.run_id` or a PR id).
2. Run migrations and tests against that branch's connection string.
3. Delete the branch with `if: always()` (`neondatabase/delete-branch-action`).

Neon describes this as replacing a shared test database and destructive cleanup scripts. Branches are copy-on-write from a parent, so a parent that already has schema (or is empty for migration-from-scratch) is the baseline. The FAQ example wires `DATABASE_URL` from `steps.branch.outputs.db_url_pooled` for tests; the TypeORM guide still requires the **direct** hostname for migrations. The create-branch action exposes both `db_url` (direct) and `db_url_pooled`.

**Other documented options** (less matching this suite's current shape):

- **Reset from parent** on a long-lived child branch (`neon branches reset … --parent` or `neondatabase/reset-branch-action`) to replace schema and data with the parent's latest. Useful for a persistent staging/dev branch, not for two parallel CI jobs unless each has its own branch.
- **Schema-only branches** for an empty-data schema copy; they are root branches and cannot reset from parent.
- **Truncate / drop schema / dedicated CI database** on one shared branch: Neon does not lead with this for CI. It is possible with SQL and with this repo's existing `clearDatabase` path if isolation and concurrency are solved elsewhere. Truncate alone would not reset the migrations table and enum/type state the way `clearDatabase` + `runMigrations` does.

For this repo, the Neon-documented fit is: drop the `postgres:16` service; create a branch per `api-e2e` / `generators` run (or one branch per workflow run if those jobs are forced sequential); point `DB_*` at that branch; use the direct host for `migration-run` / `migration-check` / `migration-generate`; wipe with existing `dropDatabase()` + migrations **inside** the branch's database. The `CREATE DATABASE juntas_e2e` step becomes optional: a branch already carries its parent's databases (e.g. `neondb`), so e2e can target that database name on the ephemeral branch and skip create. Keeping `juntas_e2e` as a second database on a shared CI branch is viable only with exclusive access per run.

Which of those layouts CI should adopt is out of scope here (sibling tickets on map issue 17).

Sources:

- [Create one branch per preview and per test run](https://neon.com/branching/ci-preview-workflows)
- [Best Postgres for CI integration tests (Neon FAQ)](https://neon.com/faqs/best-postgres-services-integration-tests-ci)
- [Automate branching with GitHub Actions](https://neon.com/docs/guides/branching-github-actions)
- [The Neon GitHub integration](https://neon.com/docs/guides/neon-github-integration)
- [create-branch-action README](https://github.com/neondatabase/create-branch-action) (outputs `db_url`, `db_url_pooled`, `db_host`, …)
- [Reset from parent](https://neon.com/docs/guides/reset-from-parent)
- [Schema-only branches](https://neon.com/docs/guides/branching-schema-only)
- [Manage databases](https://neon.com/docs/manage/databases) (500 databases per branch; `CREATE` / `DROP DATABASE`)
- [Connect from TypeORM to Neon](https://neon.com/docs/guides/typeorm) (direct for migrations, pooled for runtime)

## Secrets and connection settings GitHub Actions need

### To create and delete branches (Neon's CI Actions)

| Name              | Kind                    | Purpose                                                        |
| ----------------- | ----------------------- | -------------------------------------------------------------- |
| `NEON_API_KEY`    | repository **secret**   | Neon API authentication for create/delete/reset branch actions |
| `NEON_PROJECT_ID` | repository **variable** | Which Neon project the actions target                          |

The Neon GitHub integration can create both when a project is connected to the repo. Manual setup: create an API key in the Neon console, add the secret, copy the project id from project Settings into the variable.

### To run this API's migration CLI and e2e (this repo's env shape)

Jobs already pass discrete fields, not a URL. Whatever stores the Neon connection later (issue 22) must supply at least:

| Setting             | Role on Neon                                                                                                                                                                                                                |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host                | Neon **direct** endpoint hostname for `migration-run`, `migration-check`, `migration-generate`, and any TypeORM migration path; pooled (`-pooler`) only if used for app runtime under load                                  |
| Port                | `5432` (Neon default)                                                                                                                                                                                                       |
| Username / password | A Console/CLI/API role that owns the database (or has `CREATE` on `public`), member of `neon_superuser` if `CREATE DATABASE` remains                                                                                        |
| Database name       | User database on the branch (`neondb`, `juntas`, or `juntas_e2e` — layout ticket)                                                                                                                                           |
| SSL                 | Required; TypeORM needs `ssl: true` (or equivalent). Neon recommends `sslmode=require` and `channel_binding=require` on URLs                                                                                                |
| `E2E_DB_NAME`       | Still required by e2e-app if the suite keeps a separate e2e database name; with branch-per-run it can equal the branch's primary database name if create is dropped, but the `_e2e` suffix rule still applies in code today |
| `JWT_SECRET`        | Unchanged; not Neon-related                                                                                                                                                                                                 |

If the workflow uses create-branch-action outputs, map `db_url` / `db_host` into those fields (or into a URL shape if issue 22 chooses URLs). Do not log connection strings; they contain credentials. Action outputs are marked secret.

Cold start: Neon computes idle after inactivity (default 5 minutes; Free plan always suspends). Prefer a connect timeout long enough for wake-up if one is introduced (`connect_timeout=10` on a URL is Neon's TypeORM guidance). Today's `DataSource` sets no timeout.

Sources:

- [Automate branching with GitHub Actions](https://neon.com/docs/guides/branching-github-actions) (`NEON_API_KEY`, `NEON_PROJECT_ID`)
- [The Neon GitHub integration](https://neon.com/docs/guides/neon-github-integration) (integration sets secret + variable)
- [create-branch-action README](https://github.com/neondatabase/create-branch-action)
- [Connect from TypeORM to Neon](https://neon.com/docs/guides/typeorm)
- [Connect to Neon securely](https://neon.com/docs/connect/connect-securely)
- [Connection pooling](https://neon.com/docs/connect/connection-pooling)
- Prior issue 18 notes / this repo's `ci.yml` and `loadDatabaseConfig`

## What would block migration-run, migration-check, or the generator job

These are blockers for pointing the existing Nx targets at Neon without fixing connection/isolation first. They are not blockers in Neon's SQL for this repo's migration files (issue 18 already covered that).

1. **No SSL.** `databaseOptions` opens a plain TCP connection. Neon rejects it. Every CI step that uses TypeORM fails to connect until SSL is enabled on the shared config (or a CI-only override that still goes through that config).
2. **Pooled hostname for migrations.** `migration-run`, `migration-check`, and `migration-generate` must use the direct endpoint. Generator job runs generate after run; both need direct.
3. **Maintenance database `postgres` in e2e.** `ensureDatabaseExists` fails or is unsupported on Neon until it connects to a user database. That blocks `verify:e2e` in both `api-e2e` and `generators`.
4. **Shared Neon database across parallel jobs.** If both jobs keep `E2E_DB_NAME=juntas_e2e` on one branch without locking, they race on wipe/migrate/seed. Docker services avoided that; Neon does not.
5. **Role without `CREATE` on `public`.** Migration DDL and generate need the database owner (or an equivalent grant). A least-privilege SQL role without that grant fails create/alter.
6. **Suspended compute + short connect timeout.** Only if a short timeout is added; defaults today do not set one.
7. **Missing Neon API credentials** if the workflow switches to create/delete branch actions: jobs cannot provision isolation without `NEON_API_KEY` and `NEON_PROJECT_ID`.
8. **Removing the service without a replacement endpoint.** The workflow today depends on `localhost:5432`. Deleting the service without Neon host/secrets makes every DB step fail immediately.

Not blockers for these jobs once connection and isolation are fixed: migration SQL content, `uuid-ossp`, TypeORM `clearDatabase` as the wipe step, or staying on node-postgres in GitHub-hosted runners (long-running Node job, not edge).

Sources:

- Issue 18 research notes and [Connect from TypeORM to Neon](https://neon.com/docs/guides/typeorm)
- [Postgres compatibility](https://neon.com/docs/reference/compatibility) (no superuser; scale to zero / session context)
- This repo: `database-options.ts`, `e2e-app.ts`, `.github/workflows/ci.yml`

## Summary

| Topic                                     | Answer                                                                                                                                                                                                                                                                     |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Maintenance DB `postgres`                 | Replace with a user database on the branch (e.g. `neondb`); Neon reserves and does not expose `postgres` for app maintenance the way local Postgres does                                                                                                                   |
| Create/drop `juntas_e2e` every run        | `CREATE DATABASE` is allowed; the suite does not `DROP DATABASE` today (it clears schema). Viable on a dedicated exclusive CI database after fixing maintenance SSL/host. Neon documents **branch per run** (create → migrate/test → delete) instead of shared create/drop |
| GitHub secrets                            | `NEON_API_KEY` (secret), `NEON_PROJECT_ID` (variable) for branch actions; plus Neon host/user/password/database (direct for migrations), SSL, existing `JWT_SECRET` / `E2E_DB_NAME` as needed                                                                              |
| Blocks migration-run / check / generators | Missing SSL; pooled host for migrations; hardcoded `postgres` maintenance; concurrent jobs on one Neon DB; weak role; no Neon endpoint once the Docker service is removed                                                                                                  |
