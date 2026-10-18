import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

import {
  CreateJuntaRequest,
  JuntaDetailResponse,
  ParticipantResponse,
} from '@junta/contracts'

import { apiErrorMessage } from '@/admin/shared/api/api-error-message'
import { JuntasApi } from '@/admin/shared/api/juntas-api'
import { ParticipantsApi } from '@/admin/shared/api/participants-api'
import { Navigation } from '@/admin/shared/services/navigation'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { JuntaForm } from './components/junta-form/junta-form'

@Component({
  selector: 'ja-junta-create-feat',
  templateUrl: './create-feat.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, JuntaForm],
})
export class CreateFeat implements OnInit {
  private readonly _juntasApi = inject(JuntasApi)
  private readonly _participantsApi = inject(ParticipantsApi)
  private readonly _navigation = inject(Navigation)
  private readonly _snackbar = inject(Snackbar)

  /** Present when editing an existing junta. */
  readonly juntaId = input<string>()
  readonly isEditMode = computed(() => Boolean(this.juntaId()))
  readonly junta = signal<JuntaDetailResponse | null>(null)
  readonly participants = signal<ParticipantResponse[]>([])
  readonly loading = signal(false)
  readonly loadingParticipants = signal(false)
  readonly submitting = signal(false)

  ngOnInit(): void {
    const id = this.juntaId()

    if (id) void this._loadJunta(id)

    void this._loadParticipants()
  }

  async save(request: CreateJuntaRequest): Promise<void> {
    const id = this.juntaId()

    this.submitting.set(true)

    try {
      if (id) {
        await this._juntasApi.update(id, request)
      } else {
        await this._juntasApi.create(request)
      }

      this._snackbar.success(id ? 'Junta updated' : 'Junta created')
      this._navigation.goToJuntaList()
    } catch (error) {
      this._snackbar.error(
        apiErrorMessage(
          error,
          id ? 'Failed to update junta' : 'Failed to create junta',
        ),
      )
    } finally {
      this.submitting.set(false)
    }
  }

  cancel(): void {
    this._navigation.goToJuntaList()
  }

  private async _loadJunta(id: string): Promise<void> {
    this.loading.set(true)

    try {
      this.junta.set(await this._juntasApi.get(id))
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
      this.participants.set(await this._participantsApi.list())
    } catch {
      this._snackbar.error('Failed to load participants')
    } finally {
      this.loadingParticipants.set(false)
    }
  }
}
