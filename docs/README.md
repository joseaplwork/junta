# Documentation

Read in this order when you are new to the repository:

1. [domain.md](domain.md): what a junta is, the business rules (`BR-xx`) and
   the open product questions (`Q-xx`).
2. [architecture.md](architecture.md): projects, dependency rules, request
   flow, auth, errors and how each rule is enforced.
3. [workflow.md](workflow.md): how features go from idea to merged code with
   Claude Code and Cursor.
4. [specs/](specs/): one file per feature, written before the code.
5. [decisions/](decisions/): architecture decision records (ADRs) explaining
   why the repository looks the way it does.

Agent instructions live next to the code: [../AGENTS.md](../AGENTS.md),
[../apps/api/AGENTS.md](../apps/api/AGENTS.md) and
[../apps/admin/AGENTS.md](../apps/admin/AGENTS.md).

## Keeping docs true

- Code that implements a business rule cites its id. Change `domain.md` first.
- A rule in `AGENTS.md` is only real if something enforces it: a type, a lint
  rule, a generator, a test or a guard. When you add a convention, add its
  enforcer in the same change, or say in the rule that review enforces it.
- Nothing here is generated. Edit these files directly.
