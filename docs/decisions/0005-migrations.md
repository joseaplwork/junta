# 0005: Migrations generated from the entities

- **Status:** accepted
- **Date:** 2026-10-18
- **Supersedes:** the `DB_SYNCHRONIZE` part of [ADR 0003](0003-entities-are-the-schema.md)

## Context

ADR 0003 made the entities the only schema definition and let development
sync the schema on startup, with migrations postponed until production. On
2026-10-18 the owner asked for migrations now and for every stale table to be
dropped. A mobile app for participants is coming, so the schema will keep
changing on databases that hold real data.

## Decision

- The entities stay the source of truth. Every entity change ships with a
  migration written by `npx nx run @junta/api:migration-generate`, which diffs
  the entities against a database at the latest migration.
- `synchronize` is gone from the code. The schema changes only through
  migrations, in every environment, including the e2e database.
- Migrations live in `apps/api/src/app/database/migrations/`. The generate
  command rewrites the folder's `index.ts`, so nothing is registered by hand.
  `tools/scripts/migrations.mjs` wraps the TypeORM CLI.
- `InitialSchema` is the schema as of 2026-10-18. The development database
  was created by `synchronize`, so it was marked as having run that migration
  after `migration-check` showed it matched exactly.
- Any other database built by `synchronize` runs
  `npx nx run @junta/api:migration-baseline` once. It records only
  `InitialSchema`, applies the later migrations and checks the result.
  `migration-run --fake` is refused, because it would mark every pending
  migration as applied, including changes the database lacks.
- `DropLegacyTables` removes the empty `Payments` and `Receipts` tables and
  their enum type, which answers Q-09.
- The API refuses to start while migrations are pending.

## Consequences

- The e2e suite builds its database from the migrations and fails when they
  differ from the entities. A unit test fails when `index.ts` misses a file.
- Generating a migration needs a running database at the latest migration.
- A database created by `synchronize` elsewhere needs `migration-baseline`
  once before `migration-run`. `DropLegacyTables` refuses to run if the
  legacy tables still hold rows.
- Migrations that already ran are never edited. Data-moving changes, such as
  renaming a column with data, are written by hand after asking the owner,
  starting from `migration-create`.
