import { DatePipe } from '@angular/common'
import { Component, OnInit, inject, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatChipsModule } from '@angular/material/chips'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { ActivatedRoute } from '@angular/router'

import { Navigation } from '@/admin/shared/services/navigation'
import { Snackbar } from '@/admin/shared/services/snackbar'

import {
  JuntaDetailsData,
  JuntaWithGroups,
} from './services/junta-details-data'

@Component({
  selector: 'ja-junta-details-feat',
  templateUrl: './details-feat.html',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatExpansionModule,
    DatePipe,
  ],
})
export class DetailsFeat implements OnInit {
  private readonly _route = inject(ActivatedRoute)
  private readonly _juntaDetailsData = inject(JuntaDetailsData)
  private readonly _snackbar = inject(Snackbar)
  private readonly _navigation = inject(Navigation)

  junta = signal<JuntaWithGroups | null>(null)
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

  goBack(): void {
    this._navigation.goToJuntaList()
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  private async _loadJunta(id: string): Promise<void> {
    this.loading.set(true)
    this.error.set(null)

    try {
      const junta = await this._juntaDetailsData.fetchById(id)

      this.junta.set(junta)
    } catch {
      this.error.set('Failed to load junta')
      this._snackbar.error('Failed to load junta')
    } finally {
      this.loading.set(false)
    }
  }
}
