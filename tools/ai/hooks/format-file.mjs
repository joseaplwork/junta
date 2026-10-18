#!/usr/bin/env node
// Formats the file an agent just edited, so generated code always matches Prettier.
// Claude Code: PostToolUse hook on Edit|Write (.claude/settings.json).
// Cursor: afterFileEdit hook (.cursor/hooks.json).
// Never blocks the agent. Files that cannot be parsed are left for lint to report.
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { extname, isAbsolute, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../../', import.meta.url))
const FORMATTABLE = new Set([
  '.ts',
  '.js',
  '.mjs',
  '.cjs',
  '.json',
  '.html',
  '.scss',
  '.css',
  '.md',
  '.yml',
  '.yaml',
])

function readInput() {
  try {
    return JSON.parse(readFileSync(0, 'utf-8') || '{}')
  } catch {
    return {}
  }
}

const input = readInput()
const filePath = input.tool_input?.file_path ?? input.file_path

if (!filePath) process.exit(0)

const absolute = isAbsolute(filePath) ? filePath : join(ROOT, filePath)
const insideRepo = !relative(ROOT, absolute).startsWith('..')

if (
  !insideRepo ||
  !existsSync(absolute) ||
  !FORMATTABLE.has(extname(absolute)) ||
  absolute.includes('/node_modules/')
) {
  process.exit(0)
}

spawnSync(
  join(ROOT, 'node_modules', '.bin', 'prettier'),
  ['--write', '--log-level', 'silent', absolute],
  { cwd: ROOT, stdio: 'ignore' },
)

process.exit(0)
