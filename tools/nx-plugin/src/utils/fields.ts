export type FieldType = 'string' | 'int' | 'decimal' | 'boolean' | 'date'

export const FIELD_TYPES: readonly FieldType[] = [
  'string',
  'int',
  'decimal',
  'boolean',
  'date',
]

export interface Field {
  /** camelCase property name, e.g. dueDate */
  name: string
  /** snake_case column name, e.g. due_date */
  columnName: string
  /** Title Case UI label, e.g. Due Date */
  label: string
  type: FieldType
  optional: boolean
}

const RESERVED_NAMES = new Set(['id'])

const toSnakeCase = (name: string): string =>
  name.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)

const toLabel = (name: string): string =>
  name.replace(/([A-Z])/g, ' $1').replace(/^./, letter => letter.toUpperCase())

function parseField(entry: string): Field {
  const match = /^([a-z][a-zA-Z0-9]*)(\?)?:([a-z]+)$/.exec(entry)

  if (!match) {
    throw new Error(
      `Invalid field "${entry}". Use name:type or name?:type with a camelCase name, e.g. dueDate?:date.`,
    )
  }

  const [, name, optional, type] = match

  if (!FIELD_TYPES.includes(type as FieldType)) {
    throw new Error(
      `Unknown type "${type}" in field "${entry}". Supported types: ${FIELD_TYPES.join(', ')}.`,
    )
  }

  if (RESERVED_NAMES.has(name)) {
    throw new Error(`Field name "${name}" is reserved.`)
  }

  return {
    name,
    columnName: toSnakeCase(name),
    label: toLabel(name),
    type: type as FieldType,
    optional: Boolean(optional),
  }
}

/** Parses `--fields="title:string,amount:decimal,dueDate?:date"`. */
export function parseFields(spec: string): Field[] {
  const entries = spec
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean)

  if (entries.length === 0) {
    throw new Error(
      'Provide at least one field, e.g. --fields="title:string,amount:decimal".',
    )
  }

  const fields = entries.map(parseField)
  const seen = new Set<string>()

  for (const field of fields) {
    if (seen.has(field.name)) {
      throw new Error(`Field "${field.name}" is declared twice.`)
    }

    seen.add(field.name)
  }

  return fields
}

const TS_TYPES: Record<FieldType, string> = {
  string: 'string',
  int: 'number',
  decimal: 'number',
  boolean: 'boolean',
  date: 'string',
}

const COLUMN_TYPES: Record<FieldType, string> = {
  string: 'varchar',
  int: 'int',
  decimal: 'decimal',
  boolean: 'boolean',
  date: 'timestamptz',
}

const nullable = (field: Field, type: string): string =>
  field.optional ? `${type} | null` : type

/* ---------- API ---------- */

export function entityType(field: Field): string {
  return nullable(field, field.type === 'date' ? 'Date' : TS_TYPES[field.type])
}

export function columnDecorator(field: Field): string {
  const options = [
    field.columnName !== field.name ? `name: '${field.columnName}'` : null,
    `type: '${COLUMN_TYPES[field.type]}'`,
    field.type === 'decimal' ? 'precision: 10' : null,
    field.type === 'decimal' ? 'scale: 2' : null,
    field.type === 'decimal' ? 'transformer: numericTransformer' : null,
    field.optional ? 'nullable: true' : null,
  ].filter(Boolean)

  return `@Column({ ${options.join(', ')} })`
}

export function contractType(field: Field): string {
  return nullable(field, TS_TYPES[field.type])
}

export function requestProperty(field: Field): string {
  return field.optional
    ? `${field.name}?: ${TS_TYPES[field.type]} | null`
    : `${field.name}: ${TS_TYPES[field.type]}`
}

export function dtoDecorators(field: Field): string[] {
  const byType: Record<FieldType, string[]> = {
    string: field.optional ? ['@IsString()'] : ['@IsString()', '@IsNotEmpty()'],
    int: ['@IsInt()'],
    decimal: ['@IsNumber({ maxDecimalPlaces: 2 })'],
    boolean: ['@IsBoolean()'],
    date: ['@IsISO8601()'],
  }

  return [...(field.optional ? ['@IsOptional()'] : []), ...byType[field.type]]
}

export function validatorImports(fields: Field[]): string[] {
  const used = fields
    .flatMap(dtoDecorators)
    .map(decorator => /^@(\w+)\(/.exec(decorator)?.[1] ?? '')

  return [...new Set(used)].sort()
}

/** Entity value as a response value, e.g. `entity.dueDate.toISOString()`. */
export function responseValue(field: Field, entity: string): string {
  const access = `${entity}.${field.name}`

  if (field.type !== 'date') return access

  return field.optional
    ? `${access}?.toISOString() ?? null`
    : `${access}.toISOString()`
}

/** DTO value as an entity value, e.g. `new Date(dto.dueDate)`. */
export function entityValue(field: Field, dto: string): string {
  const access = `${dto}.${field.name}`

  if (field.type === 'date') {
    return field.optional
      ? `${access} ? new Date(${access}) : null`
      : `new Date(${access})`
  }

  return field.optional ? `${access} ?? null` : access
}

/** Sample request value for generated tests. */
export function sampleValue(field: Field): string {
  const samples: Record<FieldType, string> = {
    string: `'Sample ${field.label.toLowerCase()}'`,
    int: '3',
    decimal: '12.5',
    boolean: 'true',
    date: `'2026-01-15T00:00:00.000Z'`,
  }

  return samples[field.type]
}

/** A second sample, used to assert updates. */
export function changedSampleValue(field: Field): string {
  const samples: Record<FieldType, string> = {
    string: `'Changed ${field.label.toLowerCase()}'`,
    int: '7',
    decimal: '99.99',
    boolean: 'false',
    date: `'2026-03-01T00:00:00.000Z'`,
  }

  return samples[field.type]
}

/* ---------- Admin ---------- */

/** The field shown as the row's name in delete dialogs: first required string field. */
export function displayField(fields: Field[]): Field {
  return (
    fields.find(field => field.type === 'string' && !field.optional) ??
    fields[0]
  )
}

export function formControl(field: Field, source: string): string {
  const value = `${source}?.${field.name}`
  const required = field.optional ? '' : ', Validators.required'

  switch (field.type) {
    case 'string':
      return `[${value} ?? ''${required}]`
    case 'boolean':
      return `[${value} ?? false]`
    case 'date':
      return `[toDateInputValue(${value})${required}]`
    case 'int':
    case 'decimal':
      return field.optional
        ? `this._fb.control<number | null>(${value} ?? null)`
        : `[${value} ?? 0${required}]`
  }
}

/** Form value as a request value, e.g. `fromDateInputValue(value.dueDate)`. */
export function requestValue(field: Field, value: string): string {
  const access = `${value}.${field.name}`

  if (field.type === 'date') {
    return field.optional
      ? `${access} ? fromDateInputValue(${access}) : null`
      : `fromDateInputValue(${access})`
  }

  if (field.type === 'string' && field.optional) return `${access} || null`

  return access
}

export function formFieldHtml(field: Field): string {
  if (field.type === 'boolean') {
    return `<mat-checkbox formControlName="${field.name}">${field.label}</mat-checkbox>`
  }

  const inputType: Record<Exclude<FieldType, 'boolean'>, string> = {
    string: '',
    int: ' type="number"',
    decimal: ' type="number" step="0.01"',
    date: ' type="date"',
  }
  const error = field.optional
    ? ''
    : `\n  <mat-error>${field.label} is required</mat-error>`

  return [
    '<mat-form-field class="w-full" appearance="outline">',
    `  <mat-label>${field.label}</mat-label>`,
    `  <input matInput${inputType[field.type]} formControlName="${field.name}" />${error}`,
    '</mat-form-field>',
  ].join('\n')
}

export function tableColumn(field: Field): string {
  const base = `key: '${field.name}', header: '${field.label}'`

  switch (field.type) {
    case 'decimal':
      return `{ ${base}, type: 'currency' }`
    case 'date':
      return `{ ${base}, type: 'date' }`
    case 'boolean':
      return `{ ${base}, type: 'chip', chipColor: value => (value ? 'green' : 'gray'), chipLabel: value => (value ? 'Yes' : 'No') }`
    default:
      return `{ ${base}, type: 'text' }`
  }
}

/** The request value a dialog sends for a prefilled response value (dates round-trip locally). */
export function prefilledRequestValue(field: Field, source: string): string {
  const access = `${source}.${field.name}`

  return field.type === 'date'
    ? `fromDateInputValue(toDateInputValue(${access}))`
    : access
}

/** Row label used in the delete confirmation. */
export function displayValue(fields: Field[], source: string): string {
  const field = displayField(fields)
  const access = `${source}.${field.name}`

  return field.type === 'string' && !field.optional
    ? access
    : `String(${access})`
}

/** True when a new, empty form must be invalid (a required text or date field exists). */
export function emptyFormIsInvalid(fields: Field[]): boolean {
  return fields.some(
    field =>
      !field.optional && (field.type === 'string' || field.type === 'date'),
  )
}
