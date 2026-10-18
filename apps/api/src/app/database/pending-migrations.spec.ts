import { assertNoPendingMigrations } from './pending-migrations'

describe('assertNoPendingMigrations', () => {
  it('refuses to start while migrations are pending', async () => {
    await expect(
      assertNoPendingMigrations({ showMigrations: async () => true }),
    ).rejects.toThrow('migration-run')
  })

  it('lets an up-to-date database start', async () => {
    await expect(
      assertNoPendingMigrations({ showMigrations: async () => false }),
    ).resolves.toBeUndefined()
  })
})
