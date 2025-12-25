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
  chipColor?: (value: unknown) => 'green' | 'gray' | 'red'
  chipLabel?: (value: unknown) => string
  currencyLocale?: string
  currencyCode?: string
  dateFormat?: string
  getValue?: (row: unknown) => unknown
}
