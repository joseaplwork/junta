import { Component, OnInit, inject, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { ActivatedRoute } from '@angular/router'

import { Participant } from '@/admin/shared/interfaces/participant'
import { Navigation } from '@/admin/shared/services/navigation'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { ParticipantDetailsData } from './services/participant-details-data'

@Component({
  selector: 'ja-participant-details-feat',
  templateUrl: './details-feat.html',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatDividerModule],
})
export class DetailsFeat implements OnInit {
  private readonly _route = inject(ActivatedRoute)
  private readonly _participantDetailsData = inject(ParticipantDetailsData)
  private readonly _snackbar = inject(Snackbar)
  private readonly _navigation = inject(Navigation)

  participant = signal<Participant | null>(null)
  loading = signal(true)
  error = signal<string | null>(null)

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id')

    if (!id) {
      this._navigation.goToParticipantList()
      return
    }

    this._loadParticipant(id)
  }

  goBack(): void {
    this._navigation.goToParticipantList()
  }

  private async _loadParticipant(id: string): Promise<void> {
    this.loading.set(true)
    this.error.set(null)

    try {
      const participant = await this._participantDetailsData.fetchById(id)

      this.participant.set(participant)
    } catch {
      this.error.set('Failed to load participant')
      this._snackbar.error('Failed to load participant')
    } finally {
      this.loading.set(false)
    }
  }
}
