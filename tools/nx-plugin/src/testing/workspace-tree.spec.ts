import { readFileSync } from 'fs'
import { join } from 'path'

import { REGISTRY_FILES } from './workspace-tree'

describe('REGISTRY_FILES', () => {
  it('are inputs of the test target, so Nx reruns the generator tests when one changes', () => {
    const project = JSON.parse(
      readFileSync(join(__dirname, '../../project.json'), 'utf-8'),
    ) as { targets: { test: { inputs?: string[] } } }

    expect(project.targets.test.inputs).toEqual(
      expect.arrayContaining(
        REGISTRY_FILES.map(file => `{workspaceRoot}/${file}`),
      ),
    )
  })
})
