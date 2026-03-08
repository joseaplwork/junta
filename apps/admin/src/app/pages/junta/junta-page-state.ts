import { signal } from '@angular/core'

import { Junta } from '@/admin/shared/interfaces/junta'

export class JuntaState {
  private readonly _deleteJunta = signal<Junta | null>(null)
  private readonly _juntaDeleted = signal<Junta | null>(null)

  readonly deleteJunta = this._deleteJunta.asReadonly()
  readonly juntaDeleted = this._juntaDeleted.asReadonly()

  emitDeleteJunta(junta: Junta | null): void {
    this._deleteJunta.set(junta)
  }

  emitJuntaDeleted(junta: Junta): void {
    this._juntaDeleted.set(junta)
  }
}
