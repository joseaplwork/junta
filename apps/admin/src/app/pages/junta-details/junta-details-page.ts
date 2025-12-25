import { Component, inject, OnInit, signal } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { Junta } from '@/admin/shared/interfaces/junta'
import { Navigation } from '@/admin/shared/services/navigation'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { DetailsFeat } from './details-feat/details-feat'
import { JuntaDetailsData } from './services/junta-details-data'

@Component({
  templateUrl: './junta-details-page.html',
  imports: [DetailsFeat],
})
export class JuntaDetailsPage implements OnInit {
  private readonly _route = inject(ActivatedRoute)
  private readonly _juntaDetailsData = inject(JuntaDetailsData)
  private readonly _snackbar = inject(Snackbar)
  private readonly _navigation = inject(Navigation)

  junta = signal<Junta | null>(null)
  loading = signal(true)
  error = signal<string | null>(null)

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id')

    if (!id) {
      this._navigation.goToJuntaList()
      return
    }

    this._loadJunta(id)
  }

  private async _loadJunta(id: string): Promise<void> {
    this.loading.set(true)
    this.error.set(null)

    try {
      const junta = await this._juntaDetailsData.fetchById(id)

      if (!junta) {
        this._snackbar.error('Junta not found')
        this._navigation.goToJuntaList()
        return
      }

      this.junta.set(junta)
    } catch {
      this.error.set('Failed to load junta')
      this._snackbar.error('Failed to load junta')
    } finally {
      this.loading.set(false)
    }
  }
}

