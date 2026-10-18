import {
  GeneratorCallback,
  Tree,
  formatFiles,
  generateFiles,
  joinPathFragments,
  logger,
  visitNotIgnoredFiles,
} from '@nx/devkit'
import * as path from 'path'

import {
  addEnumMembers,
  addImport,
  addSortedExport,
  addSortedObjectProperty,
  appendArrayElement,
  moduleImportsArray,
  objectPropertyArray,
  variableArray,
} from '../../utils/ast'
import * as render from '../../utils/fields'
import { Field, parseFields } from '../../utils/fields'
import { ResourceNames, resourceNames } from '../../utils/names'

import { ApiResourceSchema } from './schema'

export const API_APP = 'apps/api/src/app'
export const CONTRACTS = 'libs/contracts/src'
export const ROLE_PERMISSIONS_FILE = 'libs/domain/src/lib/permissions.ts'
export const PERMISSION_ACTIONS = ['CREATE', 'READ', 'UPDATE', 'DELETE']

function existingTables(tree: Tree): Set<string> {
  const tables = new Set<string>()

  visitNotIgnoredFiles(tree, API_APP, file => {
    if (!file.endsWith('.entity.ts')) return

    for (const match of (tree.read(file, 'utf-8') ?? '').matchAll(
      /@Entity\(\s*'([^']+)'/g,
    )) {
      tables.add(match[1])
    }
  })

  return tables
}

function assertNew(tree: Tree, names: ResourceNames): void {
  const targets = [
    joinPathFragments(API_APP, names.pluralFile),
    joinPathFragments(CONTRACTS, 'lib', `${names.singularFile}.ts`),
  ]

  for (const target of targets) {
    if (tree.exists(target)) {
      throw new Error(
        `${target} already exists. Generators never overwrite code: pick another name or edit the existing resource.`,
      )
    }
  }

  const entities =
    tree.read(joinPathFragments(API_APP, 'database/entities.ts'), 'utf-8') ?? ''
  const contracts = tree
    .children(joinPathFragments(CONTRACTS, 'lib'))
    .filter(file => file.endsWith('.ts'))
    .map(file => tree.read(joinPathFragments(CONTRACTS, 'lib', file), 'utf-8'))
    .join('\n')
  const permissions =
    tree.read(
      joinPathFragments(CONTRACTS, 'lib/enums/permission.ts'),
      'utf-8',
    ) ?? ''
  const clashes = [
    new RegExp(`\\b${names.singularClass}\\b`).test(entities) &&
      `an entity class named ${names.singularClass}`,
    new RegExp(`\\b${names.singularClass}Response\\b`).test(contracts) &&
      `a contract named ${names.singularClass}Response`,
    new RegExp(`\\b${names.singularConstant}_READ\\b`).test(permissions) &&
      `a ${names.singularConstant}_READ permission`,
    existingTables(tree).has(names.tableName) &&
      `the database table "${names.tableName}"`,
  ].filter(Boolean)

  if (clashes.length > 0) {
    throw new Error(
      `"${names.singularFile}" clashes with existing code: ${clashes.join(', ')}. Pick another name.`,
    )
  }
}

function registerEntity(tree: Tree, names: ResourceNames): void {
  const file = joinPathFragments(API_APP, 'database/entities.ts')

  addImport(
    tree,
    file,
    `import { ${names.singularClass} } from '@/api/${names.pluralFile}/entities/${names.singularFile}.entity'`,
  )
  appendArrayElement(
    tree,
    file,
    variableArray('ENTITIES'),
    names.singularClass,
    'the ENTITIES array',
  )
}

function registerModule(tree: Tree, names: ResourceNames): void {
  const file = joinPathFragments(API_APP, 'app.module.ts')

  addImport(
    tree,
    file,
    `import { ${names.pluralClass}Module } from './${names.pluralFile}/${names.pluralFile}.module'`,
  )
  appendArrayElement(
    tree,
    file,
    moduleImportsArray,
    `${names.pluralClass}Module`,
    'the @Module imports array',
  )
}

function registerContracts(tree: Tree, names: ResourceNames): void {
  addSortedObjectProperty(
    tree,
    joinPathFragments(CONTRACTS, 'lib/api.ts'),
    'ApiResource',
    names.pluralProperty,
    `'${names.pluralFile}'`,
  )
  addSortedExport(
    tree,
    joinPathFragments(CONTRACTS, 'index.ts'),
    `export * from './lib/${names.singularFile}'`,
  )
}

/** Adds the four permissions and grants them to admins (owner decision, BR-12). */
function registerPermissions(tree: Tree, names: ResourceNames): void {
  addEnumMembers(
    tree,
    joinPathFragments(CONTRACTS, 'lib/enums/permission.ts'),
    'Permission',
    PERMISSION_ACTIONS.map(
      action =>
        `${names.singularConstant}_${action} = '${names.singularFile}:${action.toLowerCase()}'`,
    ),
  )

  for (const action of PERMISSION_ACTIONS) {
    appendArrayElement(
      tree,
      ROLE_PERMISSIONS_FILE,
      objectPropertyArray('ROLE_PERMISSIONS', '[Role.ADMIN]'),
      `Permission.${names.singularConstant}_${action}`,
      'the [Role.ADMIN] array of ROLE_PERMISSIONS',
    )
  }
}

export function templateContext(
  names: ResourceNames,
  fields: Field[],
): Record<string, unknown> {
  return {
    ...names,
    fields,
    render,
    display: render.displayField(fields),
    tmpl: '',
  }
}

/** Writes the resource without formatting. Used by this generator and by `crud`. */
export function writeApiResource(
  tree: Tree,
  options: ApiResourceSchema,
): ResourceNames {
  const names = resourceNames(options.name, options.plural)
  const fields = parseFields(options.fields)

  assertNew(tree, names)
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    '.',
    templateContext(names, fields),
  )
  registerEntity(tree, names)
  registerModule(tree, names)
  registerContracts(tree, names)
  registerPermissions(tree, names)

  return names
}

export function apiResourceNextSteps(names: ResourceNames): string {
  return [
    `Generated the ${names.singularLabel} API resource. Admins and super admins hold its ${names.singularConstant}_* permissions.`,
    'Next:',
    `  1. Write the migration: npx nx run @junta/api:migration-run, then npx nx run @junta/api:migration-generate --name=Add${names.pluralClass}, then migration-run again.`,
    `  2. Add business rules in apps/api/src/app/${names.pluralFile}/${names.pluralFile}.service.ts (pure rules go in libs/domain).`,
    '  3. Run npm run verify, then npm run verify:e2e.',
  ].join('\n')
}

export async function apiResourceGenerator(
  tree: Tree,
  options: ApiResourceSchema,
): Promise<GeneratorCallback> {
  const names = writeApiResource(tree, options)

  if (!options.skipFormat) await formatFiles(tree)

  return () => logger.info(apiResourceNextSteps(names))
}

export default apiResourceGenerator
