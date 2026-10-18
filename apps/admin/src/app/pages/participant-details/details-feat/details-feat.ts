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
import { MatIconModule } from '@angular/material/icon'

import { JuntaResponse, ParticipantResponse } from '@junta/contracts'

import { ParticipantsApi } from '@/admin/shared/api/participants-api'
import { MoneyPipe } from '@/admin/shared/pipes/money-pipe'
import { Navigation } from '@/admin/shared/services/navigation'
import { Snackbar } from '@/admin/shared/services/snackbar'

@Component({
  selector: 'ja-participant-details-feat',
  templateUrl: './details-feat.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    DatePipe,
    MoneyPipe,
  ],
})
export class DetailsFeat implements OnInit {
  private readonly _participantsApi = inject(ParticipantsApi)
  private readonly _navigation = inject(Navigation)
  private readonly _snackbar = inject(Snackbar)

  readonly participantId = input.required<string>()
  readonly participant = signal<ParticipantResponse | null>(null)
  readonly juntas = signal<JuntaResponse[]>([])
  readonly loading = signal(true)
  readonly error = signal<string | null>(null)

  ngOnInit(): void {
    void this._load(this.participantId())
  }

  goBack(): void {
    this._navigation.goToParticipantList()
  }

  goToJunta(junta: JuntaResponse): void {
    this._navigation.goToJuntaDetails(junta.id)
  }

  private async _load(id: string): Promise<void> {
    this.loading.set(true)
    this.error.set(null)

    try {
      const [participant, juntas] = await Promise.all([
        this._participantsApi.get(id),
        this._participantsApi.listJuntas(id),
      ])

      this.participant.set(participant)
      this.juntas.set(juntas)
    } catch {
      this.error.set('Failed to load participant')
      this._snackbar.error('Failed to load participant')
    } finally {
      this.loading.set(false)
    }
  }
}
