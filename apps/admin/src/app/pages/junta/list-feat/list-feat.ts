import { Component, effect, inject, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

import {
  ActionConfig,
  ColumnConfig,
  CrudDataTable,
} from '@/admin/shared/components/crud'
import { Junta } from '@/admin/shared/interfaces/junta'
import { Navigation } from '@/admin/shared/services/navigation'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { JuntaState } from '../junta-page-state'

import { JuntaData } from './services/junta-data'

@Component({
  selector: 'ja-junta-list-feat',
  imports: [CrudDataTable, MatButtonModule, MatIconModule],
  templateUrl: './list-feat.html',
})
export class ListFeat {
  private readonly _state = inject(JuntaState)
  private readonly _juntaData = inject(JuntaData)
  private readonly _snackbar = inject(Snackbar)
  private readonly _navigation = inject(Navigation)

  columns: ColumnConfig[] = [
    { key: 'name', header: 'Name', type: 'text' },
    { key: 'amount', header: 'Amount', type: 'currency' },
    { key: 'groups', header: 'Groups', type: 'text' },
    { key: 'startDate', header: 'Start Date', type: 'date' },
    { key: 'endDate', header: 'End Date', type: 'date' },
    {
      key: 'active',
      header: 'Status',
      type: 'chip',
      chipColor: (value: unknown) => (value ? 'green' : 'gray'),
      chipLabel: (value: unknown) => (value ? 'Active' : 'Finished'),
    },
  ]

  actions: ActionConfig = { view: true, edit: true, delete: true }

  juntas = signal<Junta[]>([])
  loading = signal(false)
  error = signal<string | null>(null)

  constructor() {
    this._loadJuntas()
    effect(this._listenForDeletedJunta)
  }

  viewJunta(junta: Junta): void {
    this._navigation.goToJuntaDetails(junta.id)
  }

  editJunta(junta: Junta): void {
    this._navigation.goToJuntaEdit(junta.id)
  }

  createJunta(): void {
    this._navigation.goToJuntaCreate()
  }

  deleteJunta(junta: Junta): void {
    this._state.emitDeleteJunta(junta)
  }

  private async _loadJuntas(): Promise<void> {
    this.loading.set(true)
    this.error.set(null)

    try {
      const juntas = await this._juntaData.fetchAll()

      this.juntas.set(juntas)
    } catch {
      this.error.set('Failed to load juntas')
      this._snackbar.error('Failed to load juntas')
    } finally {
      this.loading.set(false)
    }
  }

  private _listenForDeletedJunta = () => {
    const junta = this._state.juntaDeleted()

    if (junta) {
      this.juntas.update(current => current.filter(j => j.id !== junta.id))
    }
  }
}
