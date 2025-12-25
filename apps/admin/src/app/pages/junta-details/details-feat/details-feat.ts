import { DatePipe } from '@angular/common'
import { Component, inject, Input } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatChipsModule } from '@angular/material/chips'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'

import { Junta } from '@/admin/shared/interfaces/junta'
import { Navigation } from '@/admin/shared/services/navigation'

@Component({
  selector: 'ja-junta-details-feat',
  templateUrl: './details-feat.html',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    DatePipe,
  ],
})
export class DetailsFeat {
  private readonly _navigation = inject(Navigation)

  @Input({ required: true }) junta!: Junta

  goBack(): void {
    this._navigation.goToJuntaList()
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }
}

