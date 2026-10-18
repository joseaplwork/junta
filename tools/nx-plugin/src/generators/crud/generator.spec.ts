import { createWorkspaceTree } from '../../testing/workspace-tree'

import { crudGenerator } from './generator'

describe('crud generator', () => {
  it('generates the API resource and the admin page in one run', async () => {
    const tree = createWorkspaceTree()

    await crudGenerator(tree, {
      name: 'sample',
      fields: 'concept:string',
      skipFormat: true,
    })

    expect(tree.exists('apps/api/src/app/samples/samples.service.ts')).toBe(
      true,
    )
    expect(tree.exists('libs/contracts/src/lib/sample.ts')).toBe(true)
    expect(tree.exists('apps/admin/src/app/pages/sample/sample-page.ts')).toBe(
      true,
    )
  })
})
