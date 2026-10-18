import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core'

import { ParticipantResponse } from '@junta/contracts'

import { ParticipantsApi } from '@/admin/shared/api/participants-api'
import {
  ActionConfig,
  ColumnConfig,
  CrudDataTable,
} from '@/admin/shared/components/crud'
import { Navigation } from '@/admin/shared/services/navigation'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { ParticipantPageState } from '../participant-page-state'

@Component({
  selector: 'ja-participant-list-feat',
  templateUrl: './list-feat.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CrudDataTable],
})
export class ListFeat {
  private readonly _state = inject(ParticipantPageState)
  private readonly _participantsApi = inject(ParticipantsApi)
  private readonly _navigation = inject(Navigation)
  private readonly _snackbar = inject(Snackbar)

  readonly columns: ColumnConfig<ParticipantResponse>[] = [
    {
      key: 'name',
      header: 'Name',
      type: 'text',
      value: participant => `${participant.name} ${participant.surname}`,
    },
    { key: 'phoneNumber', header: 'Phone', type: 'text' },
  ]

  readonly actions: ActionConfig = { view: true, edit: true, delete: true }
  readonly participants = signal<ParticipantResponse[]>([])
  readonly loading = signal(false)
  readonly error = signal<string | null>(null)

  constructor() {
    void this._load()

    effect(() => {
      const created = this._state.created()

      if (created) this.participants.update(list => [...list, created])
    })

    effect(() => {
      const updated = this._state.updated()

      if (updated) {
        this.participants.update(list =>
          list.map(item => (item.id === updated.id ? updated : item)),
        )
      }
    })

    effect(() => {
      const deleted = this._state.deleted()

      if (deleted) {
        this.participants.update(list =>
          list.filter(item => item.id !== deleted.id),
        )
      }
    })
  }

  view(participant: ParticipantResponse): void {
    this._navigation.goToParticipantDetails(participant.id)
  }

  edit(participant: ParticipantResponse): void {
    this._state.requestUpdate(participant)
  }

  remove(participant: ParticipantResponse): void {
    this._state.requestDelete(participant)
  }

  private async _load(): Promise<void> {
    this.loading.set(true)
    this.error.set(null)

    try {
      this.participants.set(await this._participantsApi.list())
    } catch {
      this.error.set('Failed to load participants')
      this._snackbar.error('Failed to load participants')
    } finally {
      this.loading.set(false)
    }
  }
}
