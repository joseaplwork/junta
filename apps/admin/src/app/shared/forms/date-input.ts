const pad = (value: number): string => String(value).padStart(2, '0')

/** API date-time (ISO 8601) to the local `YYYY-MM-DD` value of `<input type="date">`. */
export function toDateInputValue(iso: string | null | undefined): string {
  if (!iso) return ''

  const date = new Date(iso)

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** `<input type="date">` value to an API date-time at local midnight, so the day never shifts. */
export function fromDateInputValue(value: string): string {
  const [year, month, day] = value.split('-').map(Number)

  return new Date(year, month - 1, day).toISOString()
}
