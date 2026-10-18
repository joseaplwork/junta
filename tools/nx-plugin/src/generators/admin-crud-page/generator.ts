import {
  GeneratorCallback,
  Tree,
  formatFiles,
  generateFiles,
  joinPathFragments,
  logger,
} from '@nx/devkit'
import * as path from 'path'

import {
  appendArrayElement,
  classPropertyArray,
  routeChildrenArray,
} from '../../utils/ast'
import { parseFields } from '../../utils/fields'
import { ResourceNames, resourceNames } from '../../utils/names'
import { CONTRACTS, templateContext } from '../api-resource/generator'

import { AdminCrudPageSchema } from './schema'

const ADMIN_APP = 'apps/admin/src/app'

function assertPrerequisites(tree: Tree, names: ResourceNames): void {
  const pageDir = joinPathFragments(ADMIN_APP, 'pages', names.singularFile)
  const client = joinPathFragments(
    ADMIN_APP,
    'shared/api',
    `${names.pluralFile}-api.ts`,
  )

  for (const target of [pageDir, client]) {
    if (tree.exists(target)) {
      throw new Error(
        `${target} already exists. Generators never overwrite code: pick another name or edit the existing page.`,
      )
    }
  }

  const contract = joinPathFragments(
    CONTRACTS,
    'lib',
    `${names.singularFile}.ts`,
  )
  const permissions = tree.read(
    joinPathFragments(CONTRACTS, 'lib/enums/permission.ts'),
    'utf-8',
  )

  if (
    !tree.exists(contract) ||
    !permissions?.includes(`${names.singularConstant}_READ`)
  ) {
    throw new Error(
      `The ${names.singularLabel} API resource is missing (${contract} and its permissions). Run the api-resource generator first, or use the crud generator.`,
    )
  }
}

function registerRoute(tree: Tree, names: ResourceNames): void {
  appendArrayElement(
    tree,
    joinPathFragments(ADMIN_APP, 'routes.ts'),
    routeChildrenArray('dashboard'),
    `{
      path: '${names.singularFile}',
      canActivate: [permissionGuard(Permission.${names.singularConstant}_READ)],
      loadComponent: () =>
        import('./pages/${names.singularFile}/${names.singularFile}-page').then(
          m => m.${names.singularClass}Page,
        ),
    }`,
    "the 'dashboard' route children",
  )
}

function registerMenuItem(
  tree: Tree,
  names: ResourceNames,
  icon: string,
): void {
  appendArrayElement(
    tree,
    joinPathFragments(
      ADMIN_APP,
      'layouts/main-layout/components/sidebar/sidebar.ts',
    ),
    classPropertyArray('Sidebar', 'menuItems'),
    `{
      label: '${names.pluralTitle}',
      icon: '${icon}',
      route: '/dashboard/${names.singularFile}',
      permission: Permission.${names.singularConstant}_READ,
    }`,
    'the Sidebar menuItems array',
  )
}

/** Writes the page without formatting. Used by this generator and by `crud`. */
export function writeAdminCrudPage(
  tree: Tree,
  options: AdminCrudPageSchema,
): ResourceNames {
  const names = resourceNames(options.name, options.plural)
  const fields = parseFields(options.fields)

  assertPrerequisites(tree, names)
  generateFiles(tree, path.join(__dirname, 'files'), '.', {
    ...templateContext(names, fields),
    hasBoolean: fields.some(field => field.type === 'boolean'),
    hasDate: fields.some(field => field.type === 'date'),
  })
  registerRoute(tree, names)
  registerMenuItem(tree, names, options.icon ?? 'list')

  return names
}

export function adminCrudPageNextSteps(names: ResourceNames): string {
  return [
    `Generated the ${names.pluralLabel} admin page at /dashboard/${names.singularFile}.`,
    'Next:',
    `  1. Adjust columns in apps/admin/src/app/pages/${names.singularFile}/list-feat/list-feat.ts and the form in components/${names.singularFile}-form-dialog.`,
    '  2. Run npm run verify.',
  ].join('\n')
}

export async function adminCrudPageGenerator(
  tree: Tree,
  options: AdminCrudPageSchema,
): Promise<GeneratorCallback> {
  const names = writeAdminCrudPage(tree, options)

  if (!options.skipFormat) await formatFiles(tree)

  return () => logger.info(adminCrudPageNextSteps(names))
}

export default adminCrudPageGenerator
