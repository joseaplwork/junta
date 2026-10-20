# 0009: Neon as the Postgres host

- **Status:** accepted
- **Date:** 2026-10-20

## Context

The API used a local PostgreSQL 16 instance with discrete env vars
(`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`) and CI started a
`postgres:16` service container. Schema change stayed on TypeORM migrations
([ADR 0005](0005-migrations.md)); the open question was where that Postgres
runs.

The owner chose Neon for every environment: local development, CI, and a
future deployed API. Alternatives considered and rejected for this effort:
keeping local Docker Postgres for development, ephemeral Neon branches per CI
run as the primary CI environment, and reading only discrete `DB_*` fields
without Neon's documented URL pair. Map and decisions:
[Put every Junta database on Neon](https://github.com/joseaplwork/junta/issues/17).

## Decision

- **One Neon project**, three branches: `development` (local API), `CI`
  (GitHub Actions e2e and generators), `production` (future deployed API).
- **Connection env** prefers Neon's strings: `DATABASE_URL` (pooled) and
  `DATABASE_URL_UNPOOLED` (direct). `loadDatabaseConfig` parses them into the
  in-memory `DatabaseConfig` (pooled host for the Nest app, direct host for
  the migration CLI). SSL is always on for that path; channel binding follows
  the URL query. Discrete `DB_*` remain only as a fallback when the Neon URLs
  are absent.
- **Schema** is unchanged in process: `synchronize` stays off; the eight
  migrations under `apps/api/src/app/database/migrations/` are the only schema
  path (ADR 0005).
- **CI e2e** uses the lasting `CI` branch with two databases created once
  (`juntas_e2e`, `juntas_generators_e2e`). Each job sets its own `E2E_DB_NAME`.
  Per run the suite asserts the database exists
  (`assertE2eDatabaseExists`), then
  `dropDatabase` / `clearDatabase` → `runMigrations` → seed. It never runs
  `CREATE DATABASE` on Neon.
- **Development seed:** `seedAdminAccount` via
  `npx nx run @junta/api:seed-admin` (default `admin@junta.com` /
  `e2e-password`).
- **Data cutover** from the old local `juntas` database into Neon is still
  open: that Postgres was unreachable when attempted. Schema on Neon
  development is migrated; app row import is not done.

## Consequences

- Local and CI must hold Neon credentials (URLs or secrets). The old
  localhost-only mental model is wrong for day-to-day API work.
- CI workflow still needs to drop the `postgres:16` service and point at the
  Neon `CI` branch; until then GitHub Actions does not match this ADR.
- Readers looking for `DB_HOST` in `.env` will find Neon URLs first; discrete
  fields are intentional fallback, not the primary path.
- ADR 0005 is unchanged: Neon hosts Postgres; it does not replace entity-driven
  migrations.
