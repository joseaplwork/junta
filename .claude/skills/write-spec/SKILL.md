---
name: write-spec
description: Turn a feature request into a reviewed spec in docs/specs/ before any code is written. Use when the user asks to plan, design or specify a feature, or when a request is bigger than a small fix.
argument-hint: '<feature request>'
---

# Write a spec

The request is in the arguments or in the user's message: $ARGUMENTS

Do not write or change code in this skill. The output is one spec file.

## Steps

1. Read `AGENTS.md`, `docs/domain.md` and `docs/specs/_template.md`. Skim
   existing specs in `docs/specs/` to pick the next number.
2. Find the business rules (`BR-xx`) and open questions (`Q-xx`) the request
   touches. Read the code that implements those rules (`libs/domain`) and the
   resources involved (`apps/api/src/app/<resource>/`,
   `apps/admin/src/app/pages/<page>/`).
3. List every decision the spec depends on that `docs/domain.md` does not
   answer: money, rounding, currency, permissions, deletion, data migration,
   edge cases. Ask the user these questions in one message and wait. Never
   invent business rules.
4. Write `docs/specs/NNN-<slug>.md` from the template:
   - contract changes as TypeScript snippets for `libs/contracts`;
   - an endpoint table with methods, paths, permissions and errors;
   - entity changes with database column names;
   - admin pages, features, routes and permissions;
   - mobile screens, Expo Router paths (protected under `/juntas` or public),
     i18n keys and `shared/api` clients when the feature touches the
     participant app;
   - the exact generator commands, for example
     `npx nx g @junta/nx-plugin:crud <name> --fields="..." --no-interactive`
     and `npx nx g @junta/nx-plugin:mobile-screen <name> --no-interactive`;
   - acceptance criteria that a test or a command can check;
   - a test plan per project.
5. If the answers add or change business rules, update `docs/domain.md` with
   new `BR-xx` ids and close the `Q-xx` items they resolve.
6. Set the status to `ready` only when no open questions remain. Otherwise
   leave it as `draft` and list the questions.
7. Reply with the spec path, a three-line summary and any open questions.
