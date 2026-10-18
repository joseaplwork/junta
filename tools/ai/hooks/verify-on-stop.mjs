#!/usr/bin/env node
// Runs when the agent finishes a turn. Verifies the projects affected by uncommitted
// changes (format, lint, typecheck, test) and sends failures back to the agent once.
// Claude Code: Stop hook -> `--agent=claude` (answers {"decision":"block"}).
// Cursor:      stop hook -> `--agent=cursor` (answers {"followup_message"}).
// Set JUNTA_SKIP_STOP_VERIFY=1 in the environment to turn it off for a session.
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../../', import.meta.url))
const REPORT_LINES = 60
const agent = process.argv.includes('--agent=cursor') ? 'cursor' : 'claude'

function readInput() {
  try {
    return JSON.parse(readFileSync(0, 'utf-8') || '{}')
  } catch {
    return {}
  }
}

function finish(message) {
  if (message && agent === 'claude') {
    process.stdout.write(JSON.stringify({ decision: 'block', reason: message }))
  } else if (agent === 'cursor') {
    process.stdout.write(
      JSON.stringify(message ? { followup_message: message } : {}),
    )
  }

  process.exit(0)
}

const input = readInput()
const alreadyRetried =
  agent === 'claude'
    ? input.stop_hook_active === true
    : Number(input.loop_count ?? 0) > 0
const interrupted =
  agent === 'cursor' && input.status && input.status !== 'completed'

if (
  process.env.JUNTA_SKIP_STOP_VERIFY === '1' ||
  alreadyRetried ||
  interrupted
) {
  finish()
}

const status = spawnSync('git', ['status', '--porcelain'], {
  cwd: ROOT,
  encoding: 'utf-8',
})

if (status.status !== 0 || !status.stdout.trim()) finish()

const run = spawnSync(
  process.execPath,
  [
    join(ROOT, 'tools', 'scripts', 'verify.mjs'),
    '--base=HEAD',
    '--targets=lint,typecheck,test',
  ],
  {
    cwd: ROOT,
    encoding: 'utf-8',
    env: { ...process.env, FORCE_COLOR: '0' },
    maxBuffer: 64 * 1024 * 1024,
  },
)

if (run.status === 0) finish()

const report = `${run.stdout ?? ''}\n${run.stderr ?? ''}`
  .replace(/\u001b\[[0-9;]*m/g, '')
  .split('\n')
  .filter(line => line.trim())
  .slice(-REPORT_LINES)
  .join('\n')

finish(
  [
    'Verification failed for the projects affected by your uncommitted changes (format, lint, typecheck, test).',
    'Fix the failures your changes caused, then run `npm run verify` before finishing.',
    'If a failure is unrelated to your work, say so explicitly in your final message.',
    '',
    report,
  ].join('\n'),
)
