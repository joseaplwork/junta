import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core'
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonSpinner,
} from '@ionic/angular'

import { HealthApi } from '@/mobile/shared/api/health-api'

export type ApiStatus = 'checking' | 'online' | 'offline'

/** Shows whether the app can reach the API, with a retry when it cannot. */
@Component({
  selector: 'jm-home-status-feat',
  templateUrl: './status-feat.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonChip,
    IonSpinner,
    IonButton,
  ],
})
export class StatusFeat {
  private readonly _healthApi = inject(HealthApi)

  readonly status = signal<ApiStatus>('checking')

  constructor() {
    void this.check()
  }

  async check(): Promise<void> {
    this.status.set('checking')

    try {
      await this._healthApi.check()
      this.status.set('online')
    } catch {
      this.status.set('offline')
    }
  }
}
