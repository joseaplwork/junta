import {
  columnDecorator,
  dtoDecorators,
  entityValue,
  parseFields,
  requestValue,
  responseValue,
  validatorImports,
} from './fields'

describe('parseFields', () => {
  it('parses names, types and optional markers', () => {
    expect(parseFields('title:string, dueDate?:date')).toEqual([
      {
        name: 'title',
        columnName: 'title',
        label: 'Title',
        type: 'string',
        optional: false,
      },
      {
        name: 'dueDate',
        columnName: 'due_date',
        label: 'Due Date',
        type: 'date',
        optional: true,
      },
    ])
  })

  it.each([
    ['', 'at least one field'],
    ['title', 'Invalid field'],
    ['Title:string', 'Invalid field'],
    ['title:text', 'Unknown type'],
    ['id:string', 'reserved'],
    ['title:string,title:int', 'declared twice'],
  ])('rejects "%s"', (spec, message) => {
    expect(() => parseFields(spec)).toThrow(message)
  })
})

describe('field renderers', () => {
  const [title, amount, dueDate, notes] = parseFields(
    'title:string,amount:decimal,dueDate?:date,notes?:string',
  )

  it('maps fields to TypeORM columns', () => {
    expect(columnDecorator(title)).toBe("@Column({ type: 'varchar' })")
    expect(columnDecorator(amount)).toBe(
      "@Column({ type: 'decimal', precision: 10, scale: 2, transformer: numericTransformer })",
    )
    expect(columnDecorator(dueDate)).toBe(
      "@Column({ name: 'due_date', type: 'timestamptz', nullable: true })",
    )
  })

  it('validates required text as non-empty and optional fields as optional', () => {
    expect(dtoDecorators(title)).toEqual(['@IsString()', '@IsNotEmpty()'])
    expect(dtoDecorators(notes)).toEqual(['@IsOptional()', '@IsString()'])
    expect(validatorImports([title, dueDate])).toEqual([
      'IsISO8601',
      'IsNotEmpty',
      'IsOptional',
      'IsString',
    ])
  })

  it('converts dates at every boundary', () => {
    expect(responseValue(dueDate, 'entity')).toBe(
      'entity.dueDate?.toISOString() ?? null',
    )
    expect(entityValue(dueDate, 'dto')).toBe(
      'dto.dueDate ? new Date(dto.dueDate) : null',
    )
    expect(requestValue(dueDate, 'value')).toBe(
      'value.dueDate ? fromDateInputValue(value.dueDate) : null',
    )
  })

  it('sends empty optional text as null', () => {
    expect(requestValue(notes, 'value')).toBe('value.notes || null')
  })
})
