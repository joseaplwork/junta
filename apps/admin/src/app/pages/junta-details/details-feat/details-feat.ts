import { DatePipe } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatChipsModule } from '@angular/material/chips'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'

import { JuntaDetailResponse } from '@junta/contracts'

import { JuntasApi } from '@/admin/shared/api/juntas-api'
import { juntaStatusLabel } from '@/admin/shared/format/junta-status'
import { MoneyPipe } from '@/admin/shared/pipes/money-pipe'
import { Navigation } from '@/admin/shared/services/navigation'
import { Snackbar } from '@/admin/shared/services/snackbar'

@Component({
  selector: 'ja-junta-details-feat',
  templateUrl: './details-feat.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatExpansionModule,
    DatePipe,
    MoneyPipe,
  ],
})
export class DetailsFeat implements OnInit {
  private readonly _juntasApi = inject(JuntasApi)
  private readonly _navigation = inject(Navigation)
  private readonly _snackbar = inject(Snackbar)

  readonly juntaStatusLabel = juntaStatusLabel
  readonly juntaId = input.required<string>()
  readonly junta = signal<JuntaDetailResponse | null>(null)
  readonly loading = signal(true)
  readonly error = signal<string | null>(null)

  ngOnInit(): void {
    void this._load(this.juntaId())
  }

  goBack(): void {
    this._navigation.goToJuntaList()
  }

  private async _load(id: string): Promise<void> {
    this.loading.set(true)
    this.error.set(null)

    try {
      this.junta.set(await this._juntasApi.get(id))
    } catch {
      this.error.set('Failed to load junta')
      this._snackbar.error('Failed to load junta')
    } finally {
      this.loading.set(false)
    }
  }
}
