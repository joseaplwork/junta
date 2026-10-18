import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

import { CreateParticipantRequest, ParticipantResponse } from '@junta/contracts'

import { CrudDialogShell } from '@/admin/shared/components/crud'

export interface ParticipantFormDialogData {
  title: string
  submitLabel: string
  /** Prefills the form when editing. */
  participant: ParticipantResponse | null
  /** Resolves true when saved. The dialog stays open otherwise. */
  handleSubmit: (request: CreateParticipantRequest) => Promise<boolean>
}

/** Shared by create-feat and update-feat, so it lives at page level. */
@Component({
  templateUrl: './participant-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CrudDialogShell,
  ],
})
export class ParticipantFormDialog {
  private readonly _dialogRef = inject(MatDialogRef<ParticipantFormDialog>)

  readonly data = inject<ParticipantFormDialogData>(MAT_DIALOG_DATA)
  readonly submitting = signal(false)
  readonly form = inject(FormBuilder).nonNullable.group({
    name: [this.data.participant?.name ?? '', Validators.required],
    surname: [this.data.participant?.surname ?? '', Validators.required],
    phoneNumber: [
      this.data.participant?.phoneNumber ?? '',
      Validators.required,
    ],
  })

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.submitting()) return

    this.submitting.set(true)

    const saved = await this.data.handleSubmit(this.form.getRawValue())

    this.submitting.set(false)

    if (saved) this._dialogRef.close()
  }

  onCancel(): void {
    this._dialogRef.close()
  }
}
