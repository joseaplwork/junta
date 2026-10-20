# Issue tracker: GitHub

Issues and specs for this repo live as GitHub issues in `joseaplwork/junta`. Use the GitHub MCP server (`github`). Do not use the `gh` CLI for issue or pull-request work.

The server is the official `github-mcp-server`. It authenticates with the existing `gh` login through `~/.local/bin/github-mcp-stdio`, which passes the token to the server and does not write it into the repo. Toolsets enabled: the server default, plus `labels`.

Owner is `joseaplwork`. Repository is `junta`. Read each tool's schema before calling it.

## Conventions

- **Create an issue**: `issue_write` with `method: create`, `owner`, `repo`, `title`, and `body`.
- **Read an issue**: `issue_read` with `method: get`. Comments: `method: get_comments`. Labels: `method: get_labels`. Sub-issues: `method: get_sub_issues`. Parent: `method: get_parent`.
- **List issues**: `list_issues` with `state` and `labels` filters. Ask for the fields you need; omit `body` when you only need titles and labels.
- **Search issues**: `search_issues`.
- **Make an issue a sub-issue of a parent**: `issue_write` with `method: create` and `parent_issue_number` when creating the child. To attach an existing issue, `sub_issue_write` with `method: add`. `sub_issue_id` is the issue's numeric database id from `issue_read`, not the `#number`. Without sub-issues, put `Part of #<parent>` at the top of the child body.
- **Comment**: `add_issue_comment`.
- **Apply labels**: `issue_read` with `method: get_labels`, then `issue_write` with `method: update` and the full `labels` list you want kept.
- **Close**: `issue_write` with `method: update`, `state: closed`, and a comment via `add_issue_comment` when one is needed.
- **Assign**: `issue_write` with `method: update` and `assignees`. Use the authenticated user's login for "assign me".

## Pull requests as a triage surface

**PRs as a request surface: no.** _(Set to `yes` if this repo treats external PRs as feature requests; `/triage` reads this flag.)_

When set to `yes`, PRs run through the same labels and states as issues:

- **Read a PR**: `pull_request_read` with `method: get`. Diff: `method: get_diff`. Comments: `method: get_comments`.
- **List open PRs**: `list_pull_requests` with `state: open`.
- **Comment**: `add_issue_comment` with the PR number.
- **Edit labels or close**: `update_pull_request` (`state` to close). Labels on a PR go through `issue_write` the same way as on an issue, because GitHub shares them.

GitHub shares one number space across issues and PRs, so a bare `#42` may be either: try `pull_request_read` and fall back to `issue_read`.

## When a skill says "publish to the issue tracker"

Create a GitHub issue with `issue_write`.

## When a skill says "fetch the relevant ticket"

Read it with `issue_read`.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a single issue with **child** issues as tickets.

- **Map**: a single issue labelled `wayfinder:map`, holding the Notes / Decisions-so-far / Fog body. `issue_write` with `method: create` and `labels: ["wayfinder:map"]`.
- **Child ticket**: create it with `parent_issue_number` set to the map, or attach it later with `sub_issue_write`. Where sub-issues aren't enabled, add the child to a task list in the map body and put `Part of #<map>` at the top of the child body. Labels: `wayfinder:<type>` (`research`/`prototype`/`grilling`/`task`). Once claimed, the ticket is assigned to the driving dev.
- **Blocking**: `issue_dependency_write` records a blocked-by edge, and `issue_dependency_read` lists blockers. Read each tool's schema before calling. Where those tools aren't available, put `Blocked by: #<n>, #<n>` at the top of the child body. A ticket is unblocked when every blocker is closed.
- **Frontier query**: list the map's open children (`issue_read` with `method: get_sub_issues`, or the map's task list). Drop any with an open blocker or an assignee; first in map order wins.
- **Claim**: `issue_write` with `method: update` and `assignees` set to the authenticated user. That is the session's first write.
- **Resolve**: `add_issue_comment` with the answer, then `issue_write` with `method: update` and `state: closed`, then append a context pointer to the map's Decisions-so-far.
