# NNN: Feature title

- **Status:** draft | ready | in progress | done
- **Owner:** name
- **Rules:** BR-xx, BR-yy (from `docs/domain.md`; add new rules there first)

## Problem

Who needs what, and why. Two to five sentences.

## Decisions

Business answers this spec depends on. Link the open question it closes, for
example `Q-01: amounts keep cents; the last group absorbs the remainder.`

## Scope

- In: ...
- Out: ...

## Contract changes (`libs/contracts`)

```ts
// New or changed request and response types, enums and ApiResource entries.
```

## API changes (`apps/api`)

| Method | Path | Permission | Request | Response | Errors |
| ------ | ---- | ---------- | ------- | -------- | ------ |

Entity changes: list new columns with their database names. Renaming an
existing column needs a data plan.

## Admin changes (`apps/admin`)

Pages, features, routes, sidebar entries and permissions.

## Mobile changes (`apps/mobile`)

Screens, Expo Router paths (protected under `/juntas` or public), i18n keys
and `shared/api` clients. Write "none" when the feature is admin/API only.

## Generator commands

```sh
npx nx g @junta/nx-plugin:crud <name> --fields="<spec>" --no-interactive
npx nx g @junta/nx-plugin:mobile-screen <name> --protected --no-interactive
```

Write "none" and the reason if the feature changes existing code only.

## Acceptance criteria

Each item must be checkable by a test or a command.

- [ ] ...

## Test plan

- `libs/domain`: rule tests named after each BR id.
- `apps/api`: unit tests for services, e2e for each endpoint.
- `apps/admin`: component tests for new dialogs and lists.
- `apps/mobile`: RNTL tests for new features; locale key parity.

## Open questions

Questions still waiting for an answer. The spec is not `ready` while any remain.
