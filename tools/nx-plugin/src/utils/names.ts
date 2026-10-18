import { names } from '@nx/devkit'

export interface ResourceNames {
  /** payment-reminder */
  singularFile: string
  /** PaymentReminder */
  singularClass: string
  /** paymentReminder */
  singularProperty: string
  /** PAYMENT_REMINDER */
  singularConstant: string
  /** Payment Reminder */
  singularTitle: string
  /** Payment reminder */
  singularLabel: string
  /** payment-reminders */
  pluralFile: string
  /** PaymentReminders */
  pluralClass: string
  /** paymentReminders */
  pluralProperty: string
  /** Payment Reminders */
  pluralTitle: string
  /** Payment reminders */
  pluralLabel: string
  /** PaymentReminders: table names are PascalCase plurals, like the existing tables. */
  tableName: string
}

export function pluralize(word: string): string {
  if (/[^aeiou]y$/.test(word)) return `${word.slice(0, -1)}ies`
  if (/(s|x|z|ch|sh)$/.test(word)) return `${word}es`

  return `${word}s`
}

const titleCase = (kebab: string): string =>
  kebab
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

const sentenceCase = (kebab: string): string => {
  const words = kebab.split('-')

  return [titleCase(words[0]), ...words.slice(1)].join(' ')
}

/**
 * Resource names whose derived identifiers collide with code in the generator
 * templates (framework imports, dialog data fields, list feature fields, test
 * variables). Each produced code that does not compile.
 */
export const RESERVED_RESOURCE_NAMES = new Set([
  'action',
  'column',
  'controller',
  'data',
  'dto',
  'entity',
  'form',
  'module',
  'repository',
  'request',
  'service',
  'submit-label',
  'test',
  'title',
])

const RESERVED_PLURAL_PROPERTIES = new Set(['actions', 'columns'])

/** Every name a generated resource uses, derived from one singular name. */
export function resourceNames(name: string, plural?: string): ResourceNames {
  const singular = names(name)

  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(singular.fileName)) {
    throw new Error(
      `Invalid name "${name}". Use a singular noun such as "payment" or "payment-reminder".`,
    )
  }

  const pluralNames = names(plural ?? pluralize(singular.fileName))

  if (pluralNames.fileName === singular.fileName) {
    throw new Error(`The plural of "${name}" must differ from the singular.`)
  }

  if (
    RESERVED_RESOURCE_NAMES.has(singular.fileName) ||
    RESERVED_PLURAL_PROPERTIES.has(pluralNames.propertyName)
  ) {
    throw new Error(
      `"${singular.fileName}" is reserved: its generated identifiers clash with framework or template code. Use a more specific name, e.g. "${singular.fileName}-item".`,
    )
  }

  return {
    singularFile: singular.fileName,
    singularClass: singular.className,
    singularProperty: singular.propertyName,
    singularConstant: singular.constantName,
    singularTitle: titleCase(singular.fileName),
    singularLabel: sentenceCase(singular.fileName),
    pluralFile: pluralNames.fileName,
    pluralClass: pluralNames.className,
    pluralProperty: pluralNames.propertyName,
    pluralTitle: titleCase(pluralNames.fileName),
    pluralLabel: sentenceCase(pluralNames.fileName),
    tableName: pluralNames.className,
  }
}
