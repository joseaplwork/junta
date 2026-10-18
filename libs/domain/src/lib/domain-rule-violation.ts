/**
 * Thrown when input breaks a business rule from docs/domain.md.
 * `rule` is the rule id (for example `BR-05`). The API maps this error to HTTP 400.
 */
export class DomainRuleViolation extends Error {
  constructor(
    readonly rule: string,
    message: string,
  ) {
    super(message)
    this.name = 'DomainRuleViolation'
  }
}

export function assertPositiveInteger(
  value: number,
  rule: string,
  label: string,
): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new DomainRuleViolation(rule, `${label} must be a positive integer`)
  }
}
