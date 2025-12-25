import { signal } from '@angular/core'

import { Junta } from '@/admin/shared/interfaces/junta'

export class JuntaState {
  private readonly _deleteJunta = signal<Junta | null>(null)
  private readonly _juntaDeleted = signal<Junta | null>(null)
  private readonly _juntaCreated = signal<Junta | null>(null)
  private readonly _updateJunta = signal<Junta | null>(null)
  private readonly _juntaUpdated = signal<Junta | null>(null)

  readonly deleteJunta = this._deleteJunta.asReadonly()
  readonly juntaDeleted = this._juntaDeleted.asReadonly()
  readonly juntaCreated = this._juntaCreated.asReadonly()
  readonly updateJunta = this._updateJunta.asReadonly()
  readonly juntaUpdated = this._juntaUpdated.asReadonly()

  emitDeleteJunta(junta: Junta | null): void {
    this._deleteJunta.set(junta)
  }

  emitJuntaDeleted(junta: Junta): void {
    this._juntaDeleted.set(junta)
  }

  emitJuntaCreated(junta: Junta): void {
    this._juntaCreated.set(junta)
  }

  emitUpdateJunta(junta: Junta | null): void {
    this._updateJunta.set(junta)
  }

  emitJuntaUpdated(junta: Junta): void {
    this._juntaUpdated.set(junta)
  }
}

