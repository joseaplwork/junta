import { i18n } from '@/mobile/shared/i18n'

/** Whole units (BR-03) in the junta's ISO 4217 currency (BR-13). */
export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

/** "febrero de 2026". Dates are formatted in UTC, like the API computes them. */
export function formatMonth(isoDate: string): string {
  return new Intl.DateTimeFormat(i18n.language, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(isoDate))
}

export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat(i18n.language, {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(isoDate))
}
