# 005: Mobile AI-predictable generation

- **Status:** done
- **Owner:** joseaplwork
- **Rules:** none (tooling only)

## Problem

Agents can invent mobile screen layouts, skip i18n, or call the HTTP layer
from the wrong place. Admin and API already generate recurring shapes and
lint drift; mobile needs the same so new participant UI does not become tech
debt.

## Decisions

- Follow [ADR 0008](../decisions/0008-mobile-screens-and-features.md).
- Generator scaffolds route + screen + one feature + spec + locale stubs.
- No mobile CRUD generator: participant flows are not admin-style CRUD.
- API clients in `shared/api` stay hand-written beside `me-api.ts`.

## Scope

- In: ADR, `mobile-screen` generator, mobile lint tightenings, AGENTS and
  skills, Generators CI, spec template Mobile section.
- Out: regenerating existing screens, OpenAPI client generation, lint for
  every hard-coded string.

## Contract changes (`libs/contracts`)

none

## API changes (`apps/api`)

none

## Admin changes (`apps/admin`)

none

## Mobile changes (`apps/mobile`)

- Generator creates `app/<route>.tsx` (or under `juntas/` when protected),
  `screens/<name>/`, one `<feature>-feature/` with StyleSheet UI and an RNTL
  spec, and stub keys in `locales/es.ts` / `en.ts`.
- Lint bans `api-client` imports from routes/screens and `expo-secure-store`
  outside `shared/auth`.

## Generator commands

```sh
npx nx g @junta/nx-plugin:mobile-screen <name> \
  --feature=<feature> \
  --route=<expo-route> \
  --protected \
  --no-interactive
```

## Acceptance criteria

- [x] `npx nx g @junta/nx-plugin:mobile-screen …` creates the documented tree
      and refuses to overwrite existing paths.
- [x] Generator snapshot tests pass in `@junta/nx-plugin`.
- [x] Importing `api-client` from a screen or `expo-secure-store` outside
      `shared/auth` fails mobile lint.
- [x] `implement-spec` and `new-mobile-screen` require the generator;
      `AGENTS.md` lists the command and enforcers; canonical example is
      `my-juntas`.
- [x] Generators CI runs `mobile-screen` for `ci-sample` and verifies
      `@junta/mobile`.
- [x] `npm run verify` passes.

## Test plan

- `tools/nx-plugin`: generator unit and snapshot tests.
- `apps/mobile`: existing suite stays green; generated sample lint/typecheck/test in CI.
- No domain or API tests (tooling only).

## Open questions

none
