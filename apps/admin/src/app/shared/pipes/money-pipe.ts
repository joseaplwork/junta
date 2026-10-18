import { Pipe, PipeTransform } from '@angular/core'

/**
 * Amounts are whole units (BR-03) in the junta's ISO 4217 currency (BR-13),
 * formatted for the browser's locale. Without a currency, a plain number.
 */
export function formatMoney(amount: number, currency?: string): string {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
    ...(currency ? { style: 'currency', currency } : {}),
  }).format(amount)
}

@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  transform(amount: number | null | undefined, currency?: string): string {
    return amount === null || amount === undefined
      ? ''
      : formatMoney(amount, currency)
  }
}
