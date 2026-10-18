import {
  GeneratorCallback,
  Tree,
  formatFiles,
  generateFiles,
  joinPathFragments,
  logger,
  names,
} from '@nx/devkit'
import * as path from 'path'

import { addSortedObjectProperty } from '../../utils/ast'

import { MobileScreenSchema } from './schema'

const MOBILE_APP = 'apps/mobile/src'
const LAYOUT = joinPathFragments(MOBILE_APP, 'app/_layout.tsx')
const ES_LOCALE = joinPathFragments(MOBILE_APP, 'shared/i18n/locales/es.ts')
const EN_LOCALE = joinPathFragments(MOBILE_APP, 'shared/i18n/locales/en.ts')

const RESERVED_SCREEN_NAMES = new Set([
  'app',
  'index',
  'juntas',
  'register',
  'sign-in',
  'shared',
  'screens',
])

export interface MobileScreenNames {
  screenFile: string
  screenClass: string
  featureFile: string
  featureClass: string
  routeFile: string
  routeDir: string
  routeHref: string
  i18nNamespace: string
  titleEs: string
  titleEn: string
  loadedEs: string
  loadedEn: string
  protected: boolean
}

function kebabName(value: string, label: string): string {
  const parsed = names(value)

  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(parsed.fileName)) {
    throw new Error(
      `Invalid ${label} "${value}". Use kebab-case such as "settings" or "payout-history".`,
    )
  }

  return parsed.fileName
}

export function mobileScreenNames(
  options: MobileScreenSchema,
): MobileScreenNames {
  const screenFile = kebabName(options.name, 'screen name')

  if (RESERVED_SCREEN_NAMES.has(screenFile)) {
    throw new Error(
      `"${screenFile}" is reserved by the mobile app. Pick another screen name.`,
    )
  }

  const featureFile = kebabName(options.feature ?? options.name, 'feature name')
  const routeFile = kebabName(options.route ?? options.name, 'route name')
  const screen = names(screenFile)
  const feature = names(featureFile)
  const isProtected = options.protected === true
  const titleEs = screen.className.replace(/([a-z])([A-Z])/g, '$1 $2')
  const titleEn = titleEs

  return {
    screenFile,
    screenClass: screen.className,
    featureFile,
    featureClass: feature.className,
    routeFile,
    routeDir: isProtected
      ? joinPathFragments(MOBILE_APP, 'app/juntas')
      : joinPathFragments(MOBILE_APP, 'app'),
    routeHref: isProtected ? `/juntas/${routeFile}` : `/${routeFile}`,
    i18nNamespace: screen.propertyName,
    titleEs,
    titleEn,
    loadedEs: 'Contenido de ejemplo. Sustitúyelo por la funcionalidad real.',
    loadedEn: 'Sample content. Replace this with the real feature.',
    protected: isProtected,
  }
}

function assertPrerequisites(tree: Tree, names: MobileScreenNames): void {
  const screenDir = joinPathFragments(MOBILE_APP, 'screens', names.screenFile)
  const routePath = joinPathFragments(names.routeDir, `${names.routeFile}.tsx`)

  for (const target of [screenDir, routePath]) {
    if (tree.exists(target)) {
      throw new Error(
        `${target} already exists. Generators never overwrite code: pick another name or edit the existing screen.`,
      )
    }
  }

  for (const required of [LAYOUT, ES_LOCALE, EN_LOCALE]) {
    if (!tree.exists(required)) {
      throw new Error(`Expected ${required} to exist.`)
    }
  }

  const es = tree.read(ES_LOCALE, 'utf-8') ?? ''

  if (es.includes(`${names.i18nNamespace}:`)) {
    throw new Error(
      `Locale namespace "${names.i18nNamespace}" already exists in ${ES_LOCALE}.`,
    )
  }
}

function writeRoute(tree: Tree, screenNames: MobileScreenNames): void {
  const contents = `import { ${screenNames.screenClass}Screen } from '@/mobile/screens/${screenNames.screenFile}/${screenNames.screenFile}-screen'

export default function ${screenNames.screenClass}Route(): React.JSX.Element {
  return <${screenNames.screenClass}Screen />
}
`

  tree.write(
    joinPathFragments(screenNames.routeDir, `${screenNames.routeFile}.tsx`),
    contents,
  )
}

/** Registers a Stack.Screen title for unprotected routes. */
function registerStackScreen(tree: Tree, screenNames: MobileScreenNames): void {
  if (screenNames.protected) return

  const text = tree.read(LAYOUT, 'utf-8')

  if (text === null) throw new Error(`Expected ${LAYOUT} to exist.`)
  if (text.includes(`name="${screenNames.routeFile}"`)) return

  const marker = '<Stack.Screen name="juntas"'
  const insertion = `        <Stack.Screen
          name="${screenNames.routeFile}"
          options={{ title: t('${screenNames.i18nNamespace}.title') }}
        />
`

  if (!text.includes(marker)) {
    throw new Error(
      `Could not find the juntas Stack.Screen in ${LAYOUT}. Update the mobile-screen generator.`,
    )
  }

  tree.write(LAYOUT, text.replace(marker, `${insertion}${marker}`))
}

function quote(value: string): string {
  return JSON.stringify(value)
}

function registerLocales(tree: Tree, screenNames: MobileScreenNames): void {
  const esValue = `{
    title: ${quote(screenNames.titleEs)},
    loaded: ${quote(screenNames.loadedEs)},
  }`
  const enValue = `{
    title: ${quote(screenNames.titleEn)},
    loaded: ${quote(screenNames.loadedEn)},
  }`

  addSortedObjectProperty(
    tree,
    ES_LOCALE,
    'es',
    screenNames.i18nNamespace,
    esValue,
  )
  addSortedObjectProperty(
    tree,
    EN_LOCALE,
    'en',
    screenNames.i18nNamespace,
    enValue,
  )
}

export function writeMobileScreen(
  tree: Tree,
  options: MobileScreenSchema,
): MobileScreenNames {
  const screenNames = mobileScreenNames(options)

  assertPrerequisites(tree, screenNames)
  generateFiles(tree, path.join(__dirname, 'files'), '.', {
    ...screenNames,
    tmpl: '',
  })
  writeRoute(tree, screenNames)
  registerStackScreen(tree, screenNames)
  registerLocales(tree, screenNames)

  return screenNames
}

export function mobileScreenNextSteps(screenNames: MobileScreenNames): string {
  return [
    `Generated the ${screenNames.screenClass} mobile screen at ${screenNames.routeHref}.`,
    'Next:',
    `  1. Replace the stub load in apps/mobile/src/screens/${screenNames.screenFile}/${screenNames.featureFile}-feature/${screenNames.featureFile}-feature.tsx with a shared/api client.`,
    `  2. Expand locales for ${screenNames.i18nNamespace} in es.ts / en.ts.`,
    screenNames.protected
      ? '  3. Set the Stack.Screen title in apps/mobile/src/app/juntas/_layout.tsx if needed.'
      : null,
    '  4. Run npm run verify.',
  ]
    .filter((line): line is string => line !== null)
    .join('\n')
}

export async function mobileScreenGenerator(
  tree: Tree,
  options: MobileScreenSchema,
): Promise<GeneratorCallback> {
  const screenNames = writeMobileScreen(tree, options)

  if (!options.skipFormat) await formatFiles(tree)

  return () => logger.info(mobileScreenNextSteps(screenNames))
}

export default mobileScreenGenerator
