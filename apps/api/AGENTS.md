# API (NestJS + TypeORM)

The canonical example is `src/app/participants/`. When unsure, copy its shape.
Create new resources with the generator, never by copying folders:

```sh
npx nx g @junta/nx-plugin:api-resource <name> --fields="<spec>" --no-interactive
```

## Resource layout

Every resource follows the Nest CLI naming, one folder per resource:

```text
src/app/participants/
  participants.module.ts
  participants.controller.ts      HTTP only: route, pipes, permission, delegate
  participants.service.ts         use cases: load, apply rules, persist, map
  participants.service.spec.ts    unit tests with mocked repositories
  participant.mapper.ts           entity to contract response, the only place responses are shaped
  entities/participant.entity.ts  TypeORM entity, the schema source of truth
  dto/create-participant.dto.ts   class-validator rules, implements CreateParticipantRequest
  dto/update-participant.dto.ts   PartialType(CreateParticipantDto, { skipNullProperties: false })
test/participants.e2e-spec.ts     HTTP round trip against a real database
```

Cross-cutting code lives in `common/` (guards, decorators, filters),
`config/` (typed environment), `database/` (entity registry, migrations) and
`auth/`.

## Rules

- **Controllers**: `@Controller(ApiResource.<resource>)`, one method per
  endpoint, `@RequirePermissions(...)` on every route, `ParseUUIDPipe` on ids.
  Methods return the service call and nothing else. Lint forbids importing
  `typeorm`, `@nestjs/typeorm` or `@junta/domain` in controllers.
- **Method order**: `create`, `findAll`, `findOne`, then extra reads, `update`,
  `remove`. DELETE returns 204 with `@HttpCode(HttpStatus.NO_CONTENT)`.
- **Services** inject repositories with `@InjectRepository`. Writes that touch
  more than one row run inside `this.dataSource.transaction(...)`. Missing ids
  throw `NotFoundException`. Business rules come from `@junta/domain`.
- **Responses** are always contract types built by the resource mapper. Never
  return an entity: entities hold internals such as password hashes.
- **Updates** assign each field explicitly:
  `if (dto.name !== undefined) participant.name = dto.name`. Do not use
  `repository.merge` or `Object.assign`, which also copy `null` and extra keys.
- **Entities** use camelCase properties, snake_case columns through
  `@Column({ name: 'snake_case' })` and PascalCase plural table names. Decimal
  columns use `numericTransformer`. Register every entity in
  `database/entities.ts`.
- **Config** comes from `@Inject(APP_CONFIG) config: AppConfig`. Only
  `config/app-config.ts` reads `process.env`.
- **Auth**: `JwtAuthGuard` and `PermissionsGuard` are global. `@Public()` opts
  a route out. `@CurrentAdmin()` returns the caller. Incrementing
  `Admin.tokenVersion` revokes that admin's refresh tokens: logout and password
  changes do it (spec 002).

## Errors

Throw, and let the global filters shape the response. No try/catch in
controllers.

| Cause                                        | Status | Produced by                                       |
| -------------------------------------------- | ------ | ------------------------------------------------- |
| Body or param fails validation               | 400    | `ValidationPipe` (whitelist, forbid unknown keys) |
| Business rule broken (`DomainRuleViolation`) | 400    | `DomainRuleViolationFilter`, includes `rule`      |
| Missing or invalid token                     | 401    | `JwtAuthGuard`                                    |
| Missing permission                           | 403    | `PermissionsGuard`                                |
| Unknown id                                   | 404    | `NotFoundException` in the service                |
| Unique or foreign-key conflict               | 409    | `QueryFailedFilter`                               |

## Database and migrations

The schema changes only through migrations in
`src/app/database/migrations/`. After you change an entity:

1. `npx nx run @junta/api:migration-run` brings your database up to date.
2. `npx nx run @junta/api:migration-generate --name=<WhatChanged>` writes the
   migration and registers it in the folder's `index.ts`.
3. Read the SQL. A renamed property must keep its column `name`, otherwise the
   migration drops the column and its data. Write data-moving migrations by
   hand and ask the user first.
4. `npx nx run @junta/api:migration-run` applies it, then
   `npm run verify:e2e` checks that the migrations build exactly the entity
   schema.

- Never edit a migration that has run anywhere. Add a new one.
- The API refuses to start while migrations are pending.
- `npx nx run @junta/api:migration-check` fails when the database differs
  from the entities.
- e2e tests use `E2E_DB_NAME`, which must end in `_e2e`. The suite drops that
  database and rebuilds it from the migrations on every run.

## Tests

- **Unit**: service specs with mocked repositories and a mocked `DataSource`
  when transactions are involved. See `participants.service.spec.ts` and
  `juntas.service.spec.ts`.
- **e2e**: `test/<resource>.e2e-spec.ts` using `createE2eApp()` and
  `asSuperAdmin()` from `test/support/e2e-app.ts`. Run with
  `npm run verify:e2e`.
