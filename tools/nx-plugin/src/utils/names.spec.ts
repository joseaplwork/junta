import { pluralize, resourceNames } from './names'

describe('pluralize', () => {
  it.each([
    ['payment', 'payments'],
    ['category', 'categories'],
    ['day', 'days'],
    ['box', 'boxes'],
    ['payment-reminder', 'payment-reminders'],
  ])('%s -> %s', (singular, plural) => {
    expect(pluralize(singular)).toBe(plural)
  })
})

describe('resourceNames', () => {
  it('derives every name from one singular name', () => {
    expect(resourceNames('paymentReminder')).toEqual({
      singularFile: 'payment-reminder',
      singularClass: 'PaymentReminder',
      singularProperty: 'paymentReminder',
      singularConstant: 'PAYMENT_REMINDER',
      singularTitle: 'Payment Reminder',
      singularLabel: 'Payment reminder',
      pluralFile: 'payment-reminders',
      pluralClass: 'PaymentReminders',
      pluralProperty: 'paymentReminders',
      pluralTitle: 'Payment Reminders',
      pluralLabel: 'Payment reminders',
      tableName: 'PaymentReminders',
    })
  })

  it('accepts an explicit plural', () => {
    expect(resourceNames('person', 'people').pluralClass).toBe('People')
  })

  it('rejects names that cannot become identifiers', () => {
    expect(() => resourceNames('1st-thing')).toThrow('Invalid name')
  })
})
