import { Tree } from '@nx/devkit'

import { createWorkspaceTree, read } from '../../testing/workspace-tree'
import { apiResourceGenerator } from '../api-resource/generator'

import { adminCrudPageGenerator } from './generator'

const options = {
  skipFormat: true,
  name: 'sample-record',
  fields: 'title:string,amount:decimal,dueDate:date,sent:boolean,notes?:string',
  icon: 'notifications',
}

describe('admin-crud-page generator', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createWorkspaceTree()
  })

  it('requires the API resource first', async () => {
    await expect(adminCrudPageGenerator(tree, options)).rejects.toThrow(
      'Run the api-resource generator first',
    )
  })

  describe('after the API resource exists', () => {
    beforeEach(async () => {
      await apiResourceGenerator(tree, options)
      await adminCrudPageGenerator(tree, options)
    })

    it('creates the page features and the API client', () => {
      expect(
        tree.children('apps/admin/src/app/pages/sample-record').sort(),
      ).toEqual([
        'components',
        'create-feat',
        'delete-feat',
        'list-feat',
        'sample-record-page-state.ts',
        'sample-record-page.html',
        'sample-record-page.ts',
        'update-feat',
      ])
      expect(
        tree.exists('apps/admin/src/app/shared/api/sample-records-api.ts'),
      ).toBe(true)
    })

    it('registers a lazy, permission-guarded route and a menu entry', () => {
      const routes = read(tree, 'apps/admin/src/app/routes.ts')
      const sidebar = read(
        tree,
        'apps/admin/src/app/layouts/main-layout/components/sidebar/sidebar.ts',
      )

      expect(routes).toContain("path: 'sample-record'")
      expect(routes).toContain('permissionGuard(Permission.SAMPLE_RECORD_READ)')
      expect(routes).toContain('m => m.SampleRecordPage')
      expect(sidebar).toContain("label: 'Sample Records'")
      expect(sidebar).toContain("icon: 'notifications'")
    })

    it.each([
      'apps/admin/src/app/shared/api/sample-records-api.ts',
      'apps/admin/src/app/pages/sample-record/components/sample-record-form-dialog/sample-record-form-dialog.ts',
      'apps/admin/src/app/pages/sample-record/list-feat/list-feat.ts',
      'apps/admin/src/app/pages/sample-record/delete-feat/delete-feat.ts',
    ])('renders %s from the field spec', path => {
      expect(read(tree, path)).toMatchSnapshot()
    })
  })
})
