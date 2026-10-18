# 0003: Entities are the schema

- **Status:** accepted
- **Date:** 2026-10-17

## Context

The schema was described twice: by the TypeORM entities and by a hand-written
`resources/db/db.sql`. The SQL file had drifted. It used invalid column types
such as `timestamptz with time zone`, declared an unused enum type and
hard-coded a local database owner. Development runs with
`synchronize: true`, so the entities were already the effective schema.

## Decision

- The entities in `apps/api/src/app/**/entities/` are the only schema
  definition. `db.sql` was deleted. Business intent lives in `docs/domain.md`.
- Entity properties are camelCase and map to the existing snake_case columns
  with `@Column({ name })`. The rename was checked against the development
  database: TypeORM reported zero pending schema changes before and after.
- `DB_SYNCHRONIZE` is an environment setting. Development sets it to `true`,
  and the code default is `false`.

## Consequences

- Renaming a property without keeping its column `name` drops the column in
  development. `apps/api/AGENTS.md` warns about this.
- There are no migrations yet. Before the first production deployment, add
  TypeORM migrations generated from the entities and set
  `DB_SYNCHRONIZE=false` everywhere except local development.
