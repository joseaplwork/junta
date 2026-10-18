# 0002: Contracts and domain libraries

- **Status:** accepted
- **Date:** 2026-10-17

## Context

The API and the admin app duplicated their data shapes and mapped between
`snake_case` and `camelCase` by hand, which let them drift. An experimental
refactor split every entity into application, data-access, domain and contracts
libraries with repository ports and symbol tokens. It needed
`as unknown as Repository<Dto>` casts and put NestJS code in libraries the
Angular app was allowed to import. A feature spanned five folders.

## Decision

Keep two shared libraries, both free of frameworks:

- **`@junta/contracts`** (`type:contracts`): request and response types,
  enums and route names. It imports nothing. The API returns camelCase
  responses shaped exactly like these types.
- **`@junta/domain`** (`type:domain`): pure business rules with tests, each
  citing a rule id from `docs/domain.md`. It imports only contracts.

The API keeps persistence and orchestration inside its feature folders. A
service uses TypeORM repositories directly and maps entities to contracts.

## Consequences

- A contract change fails the compile in both apps until both are updated.
- Business rules are written once and both apps use them.
- No repository abstraction. If a second persistence technology or a second
  API ever appears, revisit this decision.
- Module boundary rules make the direction mechanical: apps may use both
  libraries, domain may use contracts, contracts use nothing.
