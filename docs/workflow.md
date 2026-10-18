# Workflow: building features with Claude Code and Cursor

The repository is set up so an agent can take a feature from request to green
code with little supervision, and so the result looks the same whichever tool
produced it. Both tools read the same instructions (`AGENTS.md`), the same
skills (`.claude/skills/`) and run the same hooks (`tools/ai/hooks/`).

## The loop

1. **Spec.** Ask the agent to run the `write-spec` skill with the feature
   request. It reads the domain, asks you the business questions it cannot
   answer and writes `docs/specs/NNN-<slug>.md`. Review and edit the spec. This
   is the cheapest place to fix a misunderstanding.
2. **Implement.** In a fresh session, possibly in the other tool, run the
   `implement-spec` skill with the spec path. It runs the generators listed in
   the spec, writes the rules and tests, and verifies.
3. **Verify.** `npm run verify` checks format, lint, typecheck, tests and
   builds of every project affected by your changes. API changes also need
   `npm run verify:e2e`. The stop hook runs a lighter version automatically
   whenever the agent finishes a turn.
4. **Review.** In Claude Code, run the `convention-reviewer` subagent on the
   diff. Then read the diff yourself. Generated code is predictable, so review
   the business logic and the tests.
5. **Commit and PR.** Use conventional commits as in the existing history, for
   example `feat(juntas): validate payout order`. The PR template carries the
   definition of done. CI must be green.

The spec file is the hand-off between planning and execution. You can plan in
Cursor and implement with Claude Code, or the other way round.

## Which tool reads what

| Concern              | Claude Code                                                                     | Cursor                                              |
| -------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------- |
| Project instructions | `CLAUDE.md`, which imports `AGENTS.md`                                          | `AGENTS.md`                                         |
| App instructions     | `apps/*/CLAUDE.md`, which import `apps/*/AGENTS.md`                             | `apps/*/AGENTS.md`                                  |
| Skills               | `.claude/skills/*/SKILL.md`                                                     | `.claude/skills/*/SKILL.md`                         |
| Format on edit       | `PostToolUse` hook in `.claude/settings.json`                                   | `afterFileEdit` hook in `.cursor/hooks.json`        |
| Verify on stop       | `Stop` hook in `.claude/settings.json`                                          | `stop` hook in `.cursor/hooks.json`                 |
| Nx MCP server        | `.mcp.json`                                                                     | `.cursor/mcp.json`                                  |
| Permissions          | `.claude/settings.json` allows Nx, npm scripts and read-only git; denies `.env` | Cursor settings                                     |
| Review subagent      | `.claude/agents/convention-reviewer.md`                                         | Not available; ask for a review against `AGENTS.md` |

Keep one source of truth: edit `AGENTS.md` and the skills, never per-tool
copies.

## Skills

| Skill               | Use it to                                                            |
| ------------------- | -------------------------------------------------------------------- |
| `write-spec`        | Turn a request into a reviewed spec. Writes no code.                 |
| `implement-spec`    | Build a spec end to end: generate, implement, test, verify, report.  |
| `new-crud-resource` | Add a resource with its API, contracts, admin page and tests.        |
| `add-field`         | Add a field to an existing resource across every layer.              |
| `domain-rule`       | Add or change a business rule in `docs/domain.md` and `libs/domain`. |
| `verify-changes`    | Run the checks and fix failures at their root.                       |

In Claude Code invoke them as `/write-spec <request>`. In Cursor type `/` and
pick the skill. Both tools also load a skill on their own when the request
matches its description.

## Hooks

- **Format on edit** (`tools/ai/hooks/format-file.mjs`) runs Prettier on each
  edited file. It never blocks.
- **Verify on stop** (`tools/ai/hooks/verify-on-stop.mjs`) runs
  `tools/scripts/verify.mjs --base=HEAD --targets=lint,typecheck,test` when
  there are uncommitted changes. On failure it sends the last lines of output
  back to the agent once, then lets it stop. Turn it off for a session with
  `JUNTA_SKIP_STOP_VERIFY=1`.

## When the agent must ask you

- Money, rounding or currency.
- Roles, permissions, or who may see what.
- Deleting or migrating data, or renaming entity columns.
- Anything that ships to the app stores: app ids, store listings, signing,
  native permissions.
- Anything listed under open questions in `domain.md`.

Answers go into `domain.md` or the spec, so the next session knows them.

## Keeping the setup healthy

- When you add a convention, add the lint rule, generator change or test that
  enforces it, and update `AGENTS.md` in the same PR.
- When you change a canonical example, such as the participants resource or
  page, update the generator templates in `tools/nx-plugin` to match. The
  generator snapshot tests and the CI `Generators` job show the effect.
- When the agent repeats a mistake, fix the instructions or add an enforcer.
  Don't just correct the code.

## CI

`.github/workflows/ci.yml` runs three jobs on every pull request. Configure
branch protection to require all three:

- **Verify**: `npm run verify` on the affected projects.
- **API e2e**: applies the migrations to a fresh PostgreSQL database, checks
  that they match the entities, then runs the e2e suite.
- **Generators**: generates a sample resource with every field type and its
  migration, then runs lint, typecheck, test, build and e2e on it.

CI builds and tests the mobile app's web code like any other project. Native
iOS and Android builds need Xcode and the Android SDK, so they run on a
developer machine for now.
