---
name: implement-spec
description: Implement a ready spec from docs/specs/ end to end, from generators through tests and verification to the report. Use when the user points at a spec file or asks to build a planned feature.
argument-hint: '<path to docs/specs/NNN-*.md>'
---

# Implement a spec

The spec is in the arguments or in the user's message: $ARGUMENTS

## Steps

1. Read the spec, `AGENTS.md`, the `AGENTS.md` of every app the spec touches
   and the business rules it cites in `docs/domain.md`. If the spec is not
   `ready` or still has open questions, stop and ask.
2. Set the spec status to `in progress`.
3. Run the generator commands from the spec exactly as written, with
   `--no-interactive`. Read the files they create before you edit them.
4. Implement in this order, so each layer compiles against the previous one:
   1. `libs/contracts`: types and enums.
   2. `libs/domain`: rules as pure functions, with tests named after their
      `BR-xx` ids. Use the `domain-rule` skill for each rule.
   3. `apps/api`: entity, DTOs, mapper, service and controller. Add a unit
      test for each new service behavior and an e2e test for each endpoint.
   4. `apps/admin`: client, page, features and tests.
5. Run `npm run verify` and fix every failure at its root. If the API changed,
   run `npm run verify:e2e` too (it needs a local Postgres; see
   `apps/api/.env.example`). Use the `verify-changes` skill when anything fails.
6. Review the diff against `AGENTS.md`. In Claude Code, run the
   `convention-reviewer` subagent and address its findings.
7. Tick the satisfied acceptance criteria in the spec and set its status to
   `done`. If a criterion could not be met, leave it unticked and say why.
8. Report: what changed per project, the commands you ran with their results,
   any entity column changes, and anything left open. Do not commit unless the
   user asks.

## Never

- Change a lint rule, a tsconfig option or a test expectation just to get
  green.
- Copy a feature folder instead of running a generator.
- Decide a business question the spec does not answer.
