import { ValueTransformer } from 'typeorm'

/** Postgres returns `decimal` columns as strings. This keeps them as numbers in entities. */
export const numericTransformer: ValueTransformer = {
  to: (value: number | null | undefined) => value,
  from: (value: string | null | undefined) =>
    value === null || value === undefined ? value : Number(value),
}
