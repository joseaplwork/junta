import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { map } from 'rxjs'

import {
  CreateJuntaRequest,
  JuntaDetailResponse,
  ParticipantResponse,
} from '@junta/contracts'
import { countJuntaMonths, shuffle, splitsEvenly } from '@junta/domain'

/** Form safety limit, not a business rule: stops half-typed years from rendering thousands of groups. */
export const MAX_FORM_MONTHS = 120

/** Currencies offered in the form (BR-13). Any ISO 4217 code is valid in the API. */
export const JUNTA_CURRENCIES = [
  'MXN',
  'PEN',
  'COP',
  'CLP',
  'ARS',
  'USD',
  'EUR',
]

const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

const daysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate()

/** Same day-of-month `months` later, clamped to the last day of shorter months. */
export function addMonths(date: Date, months: number): Date {
  const year = date.getFullYear()
  const month = date.getMonth() + months

  return new Date(
    year,
    month,
    Math.min(date.getDate(), daysInMonth(year, month)),
  )
}

const ORDINAL_SUFFIXES: Record<string, string> = {
  one: 'st',
  two: 'nd',
  few: 'rd',
  other: 'th',
}
const ordinalRules = new Intl.PluralRules('en-US', { type: 'ordinal' })

/**
 * Junta details plus the payout groups: one group per month (BR-01), each
 * participant in at most one group (BR-05), order drawn by raffle (BR-08).
 * Date edits never drop assignments: a group that still has members stays
 * visible until the admin moves them, and saving waits until groups and
 * months match.
 */
@Component({
  selector: 'ja-junta-form',
  templateUrl: './junta-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DragDropModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
})
export class JuntaForm {
  private readonly _fb = inject(FormBuilder).nonNullable
  private readonly _today = startOfDay(new Date())

  readonly initialJunta = input<JuntaDetailResponse | null>(null)
  readonly participants = input<ParticipantResponse[]>([])
  readonly loadingParticipants = input(false)
  readonly submitting = input(false)
  readonly submitLabel = input('Create Junta')

  readonly submitRequest = output<CreateJuntaRequest>()
  readonly cancelForm = output<void>()

  readonly availableListId = 'available-participants'
  readonly maxMonths = MAX_FORM_MONTHS
  readonly form = this._fb.group({
    name: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    currency: ['MXN', Validators.required],
    startDate: this._fb.control<Date | null>(null, Validators.required),
    endDate: this._fb.control<Date | null>(
      { value: null, disabled: true },
      Validators.required,
    ),
    active: [true],
  })

  /** Participant ids by payout order (index 0 is order 1). Only explicit admin actions change it. */
  private readonly _assignments = signal<string[][]>([])

  private readonly _formValue = toSignal(
    this.form.valueChanges.pipe(map(() => this.form.getRawValue())),
    { initialValue: this.form.getRawValue() },
  )

  readonly isEditMode = computed(() => this.initialJunta() !== null)
  readonly dragOverGroupIndex = signal<number | null>(null)

  /** Running juntas started in the past, so the minimum only applies when creating. */
  readonly minStartDate = computed(() =>
    this.isEditMode() ? null : this._today,
  )

  readonly minEndDate = computed(() => {
    const { startDate } = this._formValue()

    return startDate ? addMonths(startDate, 1) : null
  })

  private readonly _monthSpan = computed(() => {
    const { startDate, endDate } = this._formValue()

    return startDate && endDate ? countJuntaMonths(startDate, endDate) : 0
  })

  readonly durationTooLong = computed(() => this._monthSpan() > MAX_FORM_MONTHS)

  readonly numberOfMonths = computed(() =>
    this.durationTooLong() ? 0 : this._monthSpan(),
  )

  /** One group per month, plus any later group that still has members. */
  readonly paymentGroups = computed(() => {
    const assignments = this._assignments()
    const lastAssigned = assignments.reduce(
      (last, ids, index) => (ids.length > 0 ? index : last),
      -1,
    )
    const length = Math.max(this.numberOfMonths(), lastAssigned + 1)

    return Array.from({ length }, (_, index) => assignments[index] ?? [])
  })

  readonly currencies = JUNTA_CURRENCIES

  /** BR-03: the pool must split into equal whole amounts, one share per month. */
  readonly amountSplitsEvenly = computed(
    () =>
      this.numberOfMonths() === 0 ||
      splitsEvenly(this._formValue().amount, this.numberOfMonths()),
  )

  readonly groupsMatchMonths = computed(
    () =>
      this.numberOfMonths() > 0 &&
      this.paymentGroups().length === this.numberOfMonths(),
  )

  readonly hasAssignedParticipants = computed(() =>
    this.paymentGroups().some(group => group.length > 0),
  )

  readonly groupListIds = computed(() =>
    this.paymentGroups().map((_, index) => `group-${index}`),
  )

  readonly availableParticipants = computed(() => {
    const assigned = new Set(this._assignments().flat())

    return this.participants().filter(
      participant => !assigned.has(participant.id),
    )
  })

  readonly groupMembers = computed(() => {
    const byId = new Map(this.participants().map(p => [p.id, p]))

    return this.paymentGroups().map(ids =>
      ids
        .map(id => byId.get(id))
        .filter((member): member is ParticipantResponse => Boolean(member)),
    )
  })

  constructor() {
    effect(() => {
      const { startDate } = this._formValue()
      const endDate = this.form.controls.endDate

      if (startDate && endDate.disabled) endDate.enable()
      if (!startDate && endDate.enabled) endDate.disable()
    })

    effect(() => {
      const junta = this.initialJunta()

      if (!junta) return

      this.form.patchValue({
        name: junta.name,
        amount: junta.amount,
        currency: junta.currency,
        startDate: new Date(junta.startDate),
        endDate: new Date(junta.endDate),
        active: junta.active,
      })
      this._assignments.set(
        [...junta.groups]
          .sort((left, right) => left.order - right.order)
          .map(group => group.members.map(member => member.id)),
      )
    })
  }

  /** Creating: the end falls whole months after the start. Editing keeps stored dates valid. */
  readonly endDateFilter = (date: Date | null): boolean => {
    const startDate = this.form.controls.startDate.value
    const minEnd = this.minEndDate()

    if (!date || !startDate || !minEnd) return false
    if (startOfDay(date) < startOfDay(minEnd)) return false
    if (this.isEditMode()) return true

    return (
      date.getDate() ===
      Math.min(
        startDate.getDate(),
        daysInMonth(date.getFullYear(), date.getMonth()),
      )
    )
  }

  ordinal(position: number): string {
    return `${position}${ORDINAL_SUFFIXES[ordinalRules.select(position)]}`
  }

  onDrop(event: CdkDragDrop<string[], string[], string>, index: number): void {
    const participantId = event.item.data

    if (event.previousContainer === event.container) return
    if (this._assignments().flat().includes(participantId)) return

    this._assignments.update(groups => {
      const next = Array.from(
        { length: Math.max(groups.length, index + 1) },
        (_, groupIndex) => groups[groupIndex] ?? [],
      )

      next[index] = [...next[index], participantId]

      return next
    })
  }

  removeParticipant(participantId: string): void {
    this._assignments.update(groups =>
      groups.map(ids => ids.filter(id => id !== participantId)),
    )
  }

  runRaffle(): void {
    this._assignments.set(shuffle(this.paymentGroups()))
  }

  onSubmit(): void {
    const { name, amount, currency, startDate, endDate, active } =
      this.form.getRawValue()

    if (this.form.invalid || this.submitting()) return
    if (!startDate || !endDate) return
    if (!this.groupsMatchMonths() || !this.hasAssignedParticipants()) return
    if (!this.amountSplitsEvenly()) return

    this.submitRequest.emit({
      name,
      amount,
      currency,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      active,
      groups: this.paymentGroups().map((participantIds, index) => ({
        order: index + 1,
        participantIds,
      })),
    })
  }
}
