import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

import { JuntaResponse } from '@junta/contracts'

import { JuntasApi } from '@/admin/shared/api/juntas-api'
import {
  ActionConfig,
  ColumnConfig,
  CrudDataTable,
} from '@/admin/shared/components/crud'
import { Navigation } from '@/admin/shared/services/navigation'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { JuntaPageState } from '../junta-page-state'

@Component({
  selector: 'ja-junta-list-feat',
  templateUrl: './list-feat.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CrudDataTable, MatButtonModule, MatIconModule],
})
export class ListFeat {
  private readonly _state = inject(JuntaPageState)
  private readonly _juntasApi = inject(JuntasApi)
  private readonly _navigation = inject(Navigation)
  private readonly _snackbar = inject(Snackbar)

  readonly columns: ColumnConfig<JuntaResponse>[] = [
    { key: 'name', header: 'Name', type: 'text' },
    { key: 'amount', header: 'Amount', type: 'currency' },
    { key: 'groupCount', header: 'Groups', type: 'text' },
    { key: 'startDate', header: 'Start Date', type: 'date' },
    { key: 'endDate', header: 'End Date', type: 'date' },
    {
      key: 'active',
      header: 'Status',
      type: 'chip',
      chipColor: active => (active ? 'green' : 'gray'),
      chipLabel: active => (active ? 'Active' : 'Finished'),
    },
  ]

  readonly actions: ActionConfig = { view: true, edit: true, delete: true }
  readonly juntas = signal<JuntaResponse[]>([])
  readonly loading = signal(false)
  readonly error = signal<string | null>(null)

  constructor() {
    void this._load()

    effect(() => {
      const deleted = this._state.deleted()

      if (deleted) {
        this.juntas.update(list => list.filter(item => item.id !== deleted.id))
      }
    })
  }

  view(junta: JuntaResponse): void {
    this._navigation.goToJuntaDetails(junta.id)
  }

  edit(junta: JuntaResponse): void {
    this._navigation.goToJuntaEdit(junta.id)
  }

  create(): void {
    this._navigation.goToJuntaCreate()
  }

  remove(junta: JuntaResponse): void {
    this._state.requestDelete(junta)
  }

  private async _load(): Promise<void> {
    this.loading.set(true)
    this.error.set(null)

    try {
      this.juntas.set(await this._juntasApi.list())
    } catch {
      this.error.set('Failed to load juntas')
      this._snackbar.error('Failed to load juntas')
    } finally {
      this.loading.set(false)
    }
  }
}
