import { Pipe, PipeTransform } from '@angular/core'

/** Single place for the display currency. See open question Q-02 in docs/domain.md. */
const MONEY_FORMAT = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
})

export function formatMoney(amount: number): string {
  return MONEY_FORMAT.format(amount)
}

@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  transform(amount: number | null | undefined): string {
    return amount === null || amount === undefined ? '' : formatMoney(amount)
  }
}
