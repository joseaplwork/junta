import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop'
import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatChipsModule } from '@angular/material/chips'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'

import { GroupConfig } from '@/admin/shared/interfaces/group'
import { Participant } from '@/admin/shared/interfaces/participant'

import { JuntaWithGroups } from '../../services/junta-data'

@Component({
  selector: 'ja-junta-form',
  templateUrl: './junta-form.html',
  imports: [
    DragDropModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
})
export class JuntaForm {
  private readonly _fb = inject(FormBuilder)

  readonly initialJunta = input<JuntaWithGroups | null>(null)
  readonly participants = input<Participant[]>([])
  readonly loadingParticipants = input(false)
  readonly submitting = input(false)
  readonly isEditMode = input(false)
  readonly editId = input<string | null>(null)

  readonly cancelForm = output<void>()
  readonly submitPayload = output<{
    formValue: Record<string, unknown>
    groupConfigs: GroupConfig[]
    isEdit: boolean
    editId?: string
  }>()

  readonly assignedGroups = signal<string[][]>([])
  readonly datesUpdated = signal(0)
  readonly dragOverGroupIndex = signal<number | null>(null)
  readonly availableParticipantsListId = 'available-participants'

  readonly form = this._fb.nonNullable.group({
    name: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    startDate: [null as Date | null, Validators.required],
    endDate: [null as Date | null, Validators.required],
    active: [true],
  })

  readonly minStartDate = new Date()

  readonly endDateDisabled = computed(() => {
    const startDate = this.form.get('startDate')?.value

    return !startDate || !(startDate instanceof Date)
  })

  readonly numberOfMonths = computed(() => {
    this.datesUpdated()
    const startDate = this.form.get('startDate')?.value
    const endDate = this.form.get('endDate')?.value

    if (
      !startDate ||
      !(startDate instanceof Date) ||
      !endDate ||
      !(endDate instanceof Date)
    ) {
      return 0
    }

    const start = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1)
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth()) +
      1

    return Math.max(0, months)
  })

  readonly paymentGroups = computed(() => {
    const months = this.numberOfMonths()
    const currentGroups = this.assignedGroups()

    if (months === 0) return []

    const groups: string[][] = []

    for (let i = 0; i < months; i++) {
      groups[i] = currentGroups[i] || []
    }

    return groups
  })

  readonly canAssignParticipants = computed(() => this.numberOfMonths() > 0)
  readonly hasAssignedParticipants = computed(() =>
    this.assignedGroups().some(group => group.length > 0),
  )
  readonly connectedDropLists = computed(() => [
    this.availableParticipantsListId,
  ])

  readonly availableParticipants = computed(() => {
    if (!this.canAssignParticipants()) return []

    const assignedIds = this.assignedGroups()
      .flat()
      .filter((id): id is string => !!id)

    return this.participants().filter(p => !assignedIds.includes(p.id))
  })

  readonly availableParticipantIds = computed(() =>
    this.availableParticipants().map(p => p.id),
  )

  readonly assignedParticipants = computed(() => {
    const all = this.participants()
    const groups = this.paymentGroups()

    return groups.map(group =>
      group
        .map(id => all.find(p => p.id === id))
        .filter((p): p is Participant => !!p),
    )
  })

  constructor() {
    const endDateControl = this.form.get('endDate')

    if (endDateControl) endDateControl.disable()

    this.form.get('startDate')?.valueChanges.subscribe(startDate => {
      if (startDate && startDate instanceof Date) {
        const ctrl = this.form.get('endDate')

        if (ctrl?.disabled) ctrl.enable({ emitEvent: false })
      }
      this.datesUpdated.update(v => v + 1)
      setTimeout(() => this._updateGroupsFromDates(), 0)
    })

    this.form.get('endDate')?.valueChanges.subscribe(() => {
      this.datesUpdated.update(v => v + 1)
      setTimeout(() => this._updateGroupsFromDates(), 0)
    })

    effect(() => {
      const junta = this.initialJunta()

      if (junta) {
        this.form.patchValue({
          name: junta.name,
          amount: junta.amount,
          startDate: new Date(junta.startDate),
          endDate: new Date(junta.endDate),
          active: junta.active,
        })
        const groups = junta.groupConfigs
          .sort((a, b) => a.order - b.order)
          .map(c => c.participantIds)

        this.assignedGroups.set(groups)
        this._updateGroupsFromDates()
      }
    })
  }

  getAllGroupIds(): string[] {
    return this.paymentGroups().map((_, i) => `group-${i}`)
  }

  canDropIntoGroup(): boolean {
    return true
  }

  isDragOverGroup(groupIndex: number): boolean {
    return this.dragOverGroupIndex() === groupIndex
  }

  onDragEnded(): void {
    this.dragOverGroupIndex.set(null)
  }

  onDropListEntered(event: { container: { id: string } }): void {
    const id = event.container.id

    if (id?.startsWith('group-')) {
      this.dragOverGroupIndex.set(parseInt(id.replace('group-', ''), 10))
    }
  }

  onDropListExited(): void {
    this.dragOverGroupIndex.set(null)
  }

  onEndDateChange(): void {
    const endDate = this.form.get('endDate')?.value

    if (endDate instanceof Date) {
      this.datesUpdated.update(v => v + 1)
      setTimeout(() => this._updateGroupsFromDates(), 0)
    }
  }

  getMinEndDate(): Date | null {
    const startDate = this.form.get('startDate')?.value

    if (!startDate || !(startDate instanceof Date)) return null
    const d = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
    )

    d.setMonth(d.getMonth() + 1)
    return d
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false
    const startDate = this.form.get('startDate')?.value

    if (!startDate || !(startDate instanceof Date)) return false
    if (startDate.getDate() !== date.getDate()) return false
    const minEnd = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
    )

    minEnd.setMonth(minEnd.getMonth() + 1)
    const norm = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const normMin = new Date(
      minEnd.getFullYear(),
      minEnd.getMonth(),
      minEnd.getDate(),
    )

    return norm >= normMin
  }

  getError(control: string): string | null {
    const ctrl = this.form.get(control)

    if (ctrl?.hasError('required')) return 'This field is required'
    if (ctrl?.hasError('min')) return 'Must be greater than 0'
    return null
  }

  getOrdinalSuffix(num: number): string {
    const j = num % 10
    const k = num % 100

    if (j === 1 && k !== 11) return 'st'
    if (j === 2 && k !== 12) return 'nd'
    if (j === 3 && k !== 13) return 'rd'
    return 'th'
  }

  removeParticipant(participantId: string): void {
    this.assignedGroups.update(current =>
      current.map(g => g.filter(id => id !== participantId)),
    )
  }

  runRaffle(): void {
    this.assignedGroups.update(current => this._shuffle([...current]))
  }

  onParticipantDrop(
    event: CdkDragDrop<string[], string[], string>,
    targetGroupIndex: number,
  ): void {
    if (event.previousContainer === event.container) return
    const participantId = event.item.data as string

    if (!participantId) return
    const current = this.paymentGroups()

    if (current.flat().includes(participantId)) return
    if (targetGroupIndex < 0 || targetGroupIndex >= current.length) return
    this.assignedGroups.update(groups =>
      groups.map((g, i) =>
        i === targetGroupIndex ? [...g, participantId] : g,
      ),
    )
  }

  onCancel(): void {
    this.cancelForm.emit()
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting()) return
    if (!this.canAssignParticipants()) return
    const groups = this.assignedGroups()

    if (!groups.some(g => g.length > 0)) return

    const formValue = this.form.value
    const groupConfigs: GroupConfig[] = groups.map((participantIds, index) => ({
      order: index + 1,
      participantIds,
    }))

    this.submitPayload.emit({
      formValue: { ...formValue },
      groupConfigs,
      isEdit: this.isEditMode(),
      editId: this.isEditMode() ? (this.editId() ?? undefined) : undefined,
    })
  }

  private _shuffle<T>(array: T[]): T[] {
    const a = [...array]

    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))

      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  private _updateGroupsFromDates(): void {
    const startDate = this.form.get('startDate')?.value
    const endDate = this.form.get('endDate')?.value

    if (
      !startDate ||
      !(startDate instanceof Date) ||
      !endDate ||
      !(endDate instanceof Date)
    ) {
      this.assignedGroups.set([])
      return
    }
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1)
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth()) +
      1

    if (months <= 0) {
      this.assignedGroups.set([])
      return
    }
    const current = this.assignedGroups()
    const newGroups: string[][] = []

    for (let i = 0; i < months; i++) newGroups[i] = current[i] || []
    this.assignedGroups.set(newGroups)
  }
}
