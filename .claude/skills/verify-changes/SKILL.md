---
name: verify-changes
description: Run the repository checks (format, lint, typecheck, tests, builds, API e2e) and fix failures at their root. Use before reporting work as done, or when a check or the stop hook fails.
---

# Verify changes

## Steps

1. Run `npm run verify`. It checks format, lint, typecheck, unit tests and
   builds for every project affected by your changes, compared with `main`.
2. If you changed `apps/api`, `libs/contracts` or `libs/domain`, also run
   `npm run verify:e2e`. It needs PostgreSQL and `apps/api/.env`; if either is
   missing, say so in your report instead of skipping silently.
3. For each failure, read the first error, not the last, and fix its cause:
   - **Format**: run `npm run format`.
   - **Lint**: the message names the rule. Rules are listed in `AGENTS.md` and
     `docs/architecture.md`; follow the rule, don't disable it.
   - **Typecheck**: contract mismatches usually mean a layer is missing a
     field. Fix the layer, not the contract, unless the contract is wrong.
   - **Tests**: decide whether the code or the expectation is wrong. Change an
     expectation only when the behavior change is intended, and say so.
4. Re-run `npm run verify` until it passes.
5. Report each command with its result. If something still fails and is
   unrelated to your change, show the error and say why it is unrelated.

## Never

- Add `eslint-disable`, `@ts-ignore`, `any`, `.skip` or `.only` to get green.
- Loosen `tsconfig`, ESLint or Jest configuration.
- Delete a failing test without the user's agreement.
