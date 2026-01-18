export type ColumnType =
  | 'text'
  | 'currency'
  | 'date'
  | 'chip'
  | 'combined'
  | 'tags'

export interface ColumnConfig {
  key: string
  header: string
  type: ColumnType
  combineWith?: string
  combineFormat?: string
  chipColor?: (value: unknown) => 'green' | 'gray' | 'red' | 'yellow'
  chipLabel?: (value: unknown) => string
  tagColor?: (tag: string) => 'primary' | 'purple' | 'green' | 'blue'
  tagLabel?: (tag: string) => string
  currencyLocale?: string
  currencyCode?: string
  dateFormat?: string
  getValue?: (row: unknown) => unknown
}
