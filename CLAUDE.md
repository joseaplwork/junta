@AGENTS.md

## Claude Code

- **Skills** live in `.claude/skills/` and Cursor reads the same folder:
  `write-spec`, `implement-spec`, `new-crud-resource`, `new-mobile-screen`,
  `add-field`, `domain-rule` and `verify-changes`.
- **Hooks** in `.claude/settings.json`: every Edit or Write is formatted with
  Prettier. When you stop, `tools/ai/hooks/verify-on-stop.mjs` verifies the
  affected projects and sends failures back once. Set
  `JUNTA_SKIP_STOP_VERIFY=1` to turn the stop check off for a session.
- **Subagent** `convention-reviewer` reviews a diff against these rules. Run it
  before you report a feature as done.
- **Plan mode** is for exploring. Save any plan that should survive the
  session as a spec in `docs/specs/`.
- **MCP**: `.mcp.json` configures the Nx MCP server for project and generator
  inspection.
