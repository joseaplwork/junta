#!/usr/bin/env node
// The single definition of "verified", shared by `npm run verify`, the agent stop
// hooks and CI:
//   1. Prettier       nx format:check
//   2. Quality gates  nx affected (or run-many with --all) -t lint typecheck test build
//
// Each run gets its own Nx workspace-data directory and no daemon. Editors and MCP
// servers that recompute the project graph at the same moment (Nx Console, nx-mcp)
// therefore cannot make it fail with "No cached ProjectGraph is available".
//
// Usage: node tools/scripts/verify.mjs [--all] [--base=<git ref>] [--targets=lint,typecheck,test,build]
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const args = process.argv.slice(2)
const option = name =>
  args.find(arg => arg.startsWith(`--${name}=`))?.slice(name.length + 3)

const all = args.includes('--all')
const base = option('base')
const targets = (option('targets') ?? 'lint,typecheck,test,build').split(',')

mkdirSync(join(ROOT, '.nx'), { recursive: true })

const workspaceData = mkdtempSync(join(ROOT, '.nx', 'workspace-data-verify-'))
const env = {
  ...process.env,
  NX_DAEMON: 'false',
  NX_WORKSPACE_DATA_DIRECTORY: workspaceData,
}
const nx = join(ROOT, 'node_modules', '.bin', 'nx')
const scope = all ? ['--all'] : base ? [`--base=${base}`] : []

function step(label, nxArgs) {
  console.log(`\n> ${label}: nx ${nxArgs.join(' ')}`)

  return (
    spawnSync(nx, nxArgs, { cwd: ROOT, env, stdio: 'inherit' }).status === 0
  )
}

let verified = false

try {
  verified =
    step('Format', ['format:check', ...scope]) &&
    step(
      'Lint, typecheck, test, build',
      all
        ? ['run-many', '-t', ...targets, '--outputStyle=static']
        : ['affected', '-t', ...targets, ...scope, '--outputStyle=static'],
    )
} finally {
  rmSync(workspaceData, { recursive: true, force: true })
}

if (verified) {
  console.log('\nVerified.')
} else {
  console.error('\nVerification failed. Fix the errors above and run it again.')
}

process.exit(verified ? 0 : 1)
