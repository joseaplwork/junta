import { Tree } from '@nx/devkit'

import { createWorkspaceTree, read } from '../../testing/workspace-tree'

import { apiResourceGenerator } from './generator'

const options = {
  skipFormat: true,
  name: 'sample-record',
  fields:
    'title:string,amount:decimal,dueDate:date,sent:boolean,attempts:int,notes?:string',
}

describe('api-resource generator', () => {
  let tree: Tree

  beforeEach(async () => {
    tree = createWorkspaceTree()
    await apiResourceGenerator(tree, options)
  })

  it('creates the NestJS resource in the canonical layout', () => {
    expect(tree.children('apps/api/src/app/sample-records').sort()).toEqual([
      'dto',
      'entities',
      'sample-record.mapper.ts',
      'sample-records.controller.ts',
      'sample-records.module.ts',
      'sample-records.service.spec.ts',
      'sample-records.service.ts',
    ])
    expect(tree.children('apps/api/src/app/sample-records/dto').sort()).toEqual(
      ['create-sample-record.dto.ts', 'update-sample-record.dto.ts'],
    )
    expect(tree.exists('apps/api/test/sample-records.e2e-spec.ts')).toBe(true)
    expect(tree.exists('libs/contracts/src/lib/sample-record.ts')).toBe(true)
  })

  it('appends the entity and the module to their registries', () => {
    const entities = read(tree, 'apps/api/src/app/database/entities.ts')
    const appModule = read(tree, 'apps/api/src/app/app.module.ts')

    expect(entities).toContain(
      "import { SampleRecord } from '@/api/sample-records/entities/sample-record.entity'",
    )
    expect(entities).toMatch(/ENTITIES = \[[^\]]*\bSampleRecord,?\s*\]/)
    expect(appModule).toContain(
      "import { SampleRecordsModule } from './sample-records/sample-records.module'",
    )
    expect(appModule).toMatch(/imports: \[[^\]]*\bSampleRecordsModule,?\s*\]/)
  })

  it('adds the route constant, barrel export and permissions to the contracts', () => {
    expect(read(tree, 'libs/contracts/src/lib/api.ts')).toContain(
      "sampleRecords: 'sample-records'",
    )
    expect(read(tree, 'libs/contracts/src/index.ts')).toContain(
      "export * from './lib/sample-record'",
    )

    const permissions = read(tree, 'libs/contracts/src/lib/enums/permission.ts')

    for (const action of ['create', 'read', 'update', 'delete']) {
      expect(permissions).toContain(
        `SAMPLE_RECORD_${action.toUpperCase()} = 'sample-record:${action}'`,
      )
    }
  })

  it('grants the new permissions to admins', () => {
    const policy = read(tree, 'libs/domain/src/lib/permissions.ts')
    const adminPermissions = policy.match(/\[Role\.ADMIN\]: \[([^\]]*)\]/)?.[1]

    for (const action of ['CREATE', 'READ', 'UPDATE', 'DELETE']) {
      expect(adminPermissions).toContain(`Permission.SAMPLE_RECORD_${action}`)
    }
    expect(policy).not.toMatch(/\[Role\.PARTICIPANT\]: \[[^\]]*SAMPLE_RECORD/)
  })

  it.each([
    'libs/contracts/src/lib/sample-record.ts',
    'apps/api/src/app/sample-records/entities/sample-record.entity.ts',
    'apps/api/src/app/sample-records/dto/create-sample-record.dto.ts',
    'apps/api/src/app/sample-records/sample-record.mapper.ts',
    'apps/api/src/app/sample-records/sample-records.service.ts',
    'apps/api/src/app/sample-records/sample-records.controller.ts',
  ])('renders %s from the field spec', path => {
    expect(read(tree, path)).toMatchSnapshot()
  })

  it('never overwrites an existing resource', async () => {
    await expect(apiResourceGenerator(tree, options)).rejects.toThrow(
      'already exists',
    )
  })

  it('refuses names that clash with existing entities or contracts', async () => {
    await expect(
      apiResourceGenerator(createWorkspaceTree(), {
        name: 'group',
        fields: 'label:string',
        skipFormat: true,
      }),
    ).rejects.toThrow('an entity class named Group')
  })

  it("refuses names that land on another entity's table", async () => {
    const workspace = createWorkspaceTree()

    workspace.write(
      'apps/api/src/app/admins/entities/admin.entity.ts',
      "@Entity('Administrators')\nexport class Admin {}\n",
    )

    await expect(
      apiResourceGenerator(workspace, {
        name: 'administrator',
        fields: 'label:string',
        skipFormat: true,
      }),
    ).rejects.toThrow('the database table "Administrators"')
  })

  it.each(['test', 'title', 'column', 'module'])(
    'refuses the reserved name "%s"',
    async name => {
      await expect(
        apiResourceGenerator(createWorkspaceTree(), {
          name,
          fields: 'label:string',
          skipFormat: true,
        }),
      ).rejects.toThrow('is reserved')
    },
  )
})
