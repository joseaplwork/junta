import { Component, effect, inject, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatTableModule } from '@angular/material/table'

import { Junta } from '@/admin/shared/interfaces/junta'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { JuntaState } from '../junta-page-state'

import { JuntaListTable } from './components/junta-list-table'
import { JuntaData } from './services/junta-data'

@Component({
  selector: 'ja-junta-list-feat',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    JuntaListTable,
  ],
  templateUrl: './list-feat.html',
})
export class ListFeat {
  private readonly _state = inject(JuntaState)
  private readonly _juntaData = inject(JuntaData)
  private readonly _snackbar = inject(Snackbar)

  juntas = signal<Junta[]>([])
  loading = signal(false)
  error = signal<string | null>(null)

  constructor() {
    this.loadJuntas()

    effect(this._listenForNewJunta)
    effect(this._listenForDeletedJunta)
    effect(this._listenForUpdatedJunta)
  }

  async loadJuntas(): Promise<void> {
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

  editJunta(junta: Junta): void {
    this._state.emitUpdateJunta(junta)
  }

  deleteJunta(junta: Junta): void {
    this._state.emitDeleteJunta(junta)
  }

  private _listenForNewJunta = () => {
    const junta = this._state.juntaCreated()

    if (junta) {
      this.juntas.update(current => [...current, junta])
    }
  }

  private _listenForDeletedJunta = () => {
    const junta = this._state.juntaDeleted()

    if (junta) {
      this.juntas.update(current => current.filter(j => j.id !== junta.id))
    }
  }

  private _listenForUpdatedJunta = () => {
    const updatedJunta = this._state.juntaUpdated()

    if (updatedJunta) {
      this.juntas.update(current =>
        current.map(j => (j.id === updatedJunta.id ? updatedJunta : j)),
      )
    }
  }
}
