import { Component, OnInit, computed, inject, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { ActivatedRoute } from '@angular/router'

import { ParticipantData } from '@/admin/pages/participant/list-feat/services/participant-data'
import { Navigation } from '@/admin/shared/services/navigation'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { JuntaForm } from './components/junta-form/junta-form'
import { CreatePayload } from './interfaces/create-payload'
import { UpdatePayload } from './interfaces/update-payload'
import { JuntaCreate } from './services/junta-create'
import { JuntaData } from './services/junta-data'
import { JuntaUpdate } from './services/junta-update'

@Component({
  selector: 'ja-junta-create-feat',
  templateUrl: './create-feat.html',
  imports: [MatButtonModule, MatIconModule, JuntaForm],
})
export class CreateFeat implements OnInit {
  private readonly _route = inject(ActivatedRoute)
  private readonly _juntaCreate = inject(JuntaCreate)
  private readonly _juntaUpdate = inject(JuntaUpdate)
  private readonly _juntaData = inject(JuntaData)
  private readonly _participantData = inject(ParticipantData)
  private readonly _navigation = inject(Navigation)
  private readonly _snackbar = inject(Snackbar)

  readonly loading = signal(false)
  readonly loadingParticipants = signal(false)
  readonly submitting = signal(false)
  readonly initialJunta = signal<Awaited<
    ReturnType<JuntaData['fetchById']>
  > | null>(null)
  readonly participants = signal<
    Awaited<ReturnType<ParticipantData['fetchAll']>>
  >([])

  readonly isEditMode = computed(
    () => !!this._route.snapshot.paramMap.get('id'),
  )
  readonly editId = computed(() => this._route.snapshot.paramMap.get('id'))

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id')

    if (id) {
      this._loadJunta(id)
    }

    this._loadParticipants()
  }

  onSubmit(payload: {
    formValue: Record<string, unknown>
    groupConfigs: { order: number; participantIds: string[] }[]
    isEdit: boolean
    editId?: string
  }): void {
    const { formValue, groupConfigs, isEdit, editId: id } = payload

    if (isEdit && id) {
      const updatePayload: UpdatePayload = {
        name: formValue['name'] as string,
        amount: formValue['amount'] as number,
        startDate:
          formValue['startDate'] instanceof Date
            ? (formValue['startDate'] as Date).toISOString()
            : undefined,
        endDate:
          formValue['endDate'] instanceof Date
            ? (formValue['endDate'] as Date).toISOString()
            : undefined,
        active: formValue['active'] as boolean,
        groupConfigs,
      }

      this.submitting.set(true)
      this._juntaUpdate
        .update(id, updatePayload)
        .then(() => {
          this._snackbar.success('Junta updated successfully')
          this._navigation.goToJuntaList()
        })
        .catch(() => {
          this._snackbar.error('Failed to update junta')
        })
        .finally(() => this.submitting.set(false))
    } else {
      const createPayload: CreatePayload = {
        name: formValue['name'] as string,
        amount: formValue['amount'] as number,
        startDate: (formValue['startDate'] as Date).toISOString(),
        endDate: (formValue['endDate'] as Date).toISOString(),
        active: formValue['active'] as boolean,
        groupConfigs,
      }

      this.submitting.set(true)
      this._juntaCreate
        .create(createPayload)
        .then(() => {
          this._snackbar.success('Junta created successfully')
          this._navigation.goToJuntaList()
        })
        .catch(() => {
          this._snackbar.error('Failed to create junta')
        })
        .finally(() => this.submitting.set(false))
    }
  }

  onCancel(): void {
    this._navigation.goToJuntaList()
  }

  private async _loadJunta(id: string): Promise<void> {
    this.loading.set(true)
    try {
      const junta = await this._juntaData.fetchById(id)

      this.initialJunta.set(junta)
    } catch {
      this._snackbar.error('Failed to load junta')
      this._navigation.goToJuntaList()
    } finally {
      this.loading.set(false)
    }
  }

  private async _loadParticipants(): Promise<void> {
    this.loadingParticipants.set(true)
    try {
      const participants = await this._participantData.fetchAll()

      this.participants.set(participants)
    } catch {
      this._snackbar.error('Failed to load participants')
    } finally {
      this.loadingParticipants.set(false)
    }
  }
}
