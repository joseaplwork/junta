export type ColumnType = 'text' | 'currency' | 'date' | 'chip' | 'tags'

export type ChipColor = 'green' | 'gray' | 'red' | 'yellow'

export type TagColor = 'primary' | 'purple' | 'green' | 'blue'

export interface ColumnConfig<Row> {
  /** Row property to display, or a unique id when `value` computes the cell. */
  key: string
  header: string
  type: ColumnType
  value?: (row: Row) => unknown
  chipColor?: (value: unknown) => ChipColor
  chipLabel?: (value: unknown) => string
  tagColor?: (tag: string) => TagColor
  tagLabel?: (tag: string) => string
  dateFormat?: string
  /** ISO 4217 code for `currency` columns. Without it the amount shows as a number. */
  currency?: (row: Row) => string
}
