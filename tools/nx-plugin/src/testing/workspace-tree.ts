import { Tree } from '@nx/devkit'
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { readFileSync } from 'fs'
import { join } from 'path'

const WORKSPACE_ROOT = join(__dirname, '../../../..')

/**
 * Files the generators patch. Tests copy the real versions, so a change that
 * breaks a generator's assumptions fails the generator tests immediately.
 *
 * - Every file here is also an input of the `test` target in project.json, so
 *   Nx reruns these tests when one changes (workspace-tree.spec.ts checks it).
 * - The files grow with every real resource. Assertions must not depend on
 *   what they already contain, and fixture names (`sample`, `sample-record`)
 *   must never be real resource names.
 */
export const REGISTRY_FILES = [
  '.prettierrc',
  'apps/api/src/app/app.module.ts',
  'apps/api/src/app/database/entities.ts',
  'apps/admin/src/app/routes.ts',
  'apps/admin/src/app/layouts/main-layout/components/sidebar/sidebar.ts',
  'libs/contracts/src/index.ts',
  'libs/contracts/src/lib/api.ts',
  'libs/contracts/src/lib/enums/permission.ts',
]

export function createWorkspaceTree(): Tree {
  const tree = createTreeWithEmptyWorkspace()

  for (const file of REGISTRY_FILES) {
    tree.write(file, readFileSync(join(WORKSPACE_ROOT, file), 'utf-8'))
  }

  return tree
}

export function read(tree: Tree, path: string): string {
  const content = tree.read(path, 'utf-8')

  if (content === null) throw new Error(`Expected ${path} to exist`)

  return content
}
