import { Tree } from '@nx/devkit'

import { createWorkspaceTree, read } from '../../testing/workspace-tree'

import { mobileScreenGenerator } from './generator'

const options = {
  skipFormat: true,
  name: 'sample-panel',
}

describe('mobile-screen generator', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createWorkspaceTree()
  })

  it('creates the route, screen, feature and locales', async () => {
    await mobileScreenGenerator(tree, options)

    expect(
      tree.children('apps/mobile/src/screens/sample-panel').sort(),
    ).toEqual(['sample-panel-feature', 'sample-panel-screen.tsx'])
    expect(tree.exists('apps/mobile/src/app/sample-panel.tsx')).toBe(true)
    expect(
      tree.exists(
        'apps/mobile/src/screens/sample-panel/sample-panel-feature/sample-panel-feature.tsx',
      ),
    ).toBe(true)
    expect(
      tree.exists(
        'apps/mobile/src/screens/sample-panel/sample-panel-feature/sample-panel-feature.spec.tsx',
      ),
    ).toBe(true)

    const es = read(tree, 'apps/mobile/src/shared/i18n/locales/es.ts')
    const en = read(tree, 'apps/mobile/src/shared/i18n/locales/en.ts')
    const layout = read(tree, 'apps/mobile/src/app/_layout.tsx')

    expect(es).toContain('samplePanel:')
    expect(en).toContain('samplePanel:')
    expect(layout).toContain('name="sample-panel"')
    expect(layout).toContain("t('samplePanel.title')")
  })

  it('places protected routes under juntas and skips the root Stack entry', async () => {
    await mobileScreenGenerator(tree, {
      ...options,
      name: 'sample-panel',
      protected: true,
    })

    expect(tree.exists('apps/mobile/src/app/juntas/sample-panel.tsx')).toBe(
      true,
    )
    expect(tree.exists('apps/mobile/src/app/sample-panel.tsx')).toBe(false)
    expect(read(tree, 'apps/mobile/src/app/_layout.tsx')).not.toContain(
      'name="sample-panel"',
    )
  })

  it('refuses to overwrite an existing screen', async () => {
    await mobileScreenGenerator(tree, options)

    await expect(mobileScreenGenerator(tree, options)).rejects.toThrow(
      'already exists',
    )
  })

  it('rejects reserved screen names', async () => {
    await expect(
      mobileScreenGenerator(tree, { ...options, name: 'juntas' }),
    ).rejects.toThrow('reserved')
  })

  it.each([
    'apps/mobile/src/app/sample-panel.tsx',
    'apps/mobile/src/screens/sample-panel/sample-panel-screen.tsx',
    'apps/mobile/src/screens/sample-panel/sample-panel-feature/sample-panel-feature.tsx',
    'apps/mobile/src/screens/sample-panel/sample-panel-feature/sample-panel-feature.spec.tsx',
  ])('renders %s from the screen name', async path => {
    await mobileScreenGenerator(tree, options)
    expect(read(tree, path)).toMatchSnapshot()
  })
})
