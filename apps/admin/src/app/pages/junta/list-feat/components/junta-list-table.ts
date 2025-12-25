import { DatePipe } from '@angular/common'
import { Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatChipsModule } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon'
import { MatTableModule } from '@angular/material/table'

import { Junta } from '@/admin/shared/interfaces/junta'
import { Navigation } from '@/admin/shared/services/navigation'

@Component({
  selector: 'ja-junta-list-table',
  templateUrl: './junta-list-table.html',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    DatePipe,
  ],
})
export class JuntaListTable {
  private readonly _navigation = inject(Navigation)

  @Input() juntas: Junta[] = []
  @Input() loading = false
  @Input() error: string | null = null

  @Output() editJunta = new EventEmitter<Junta>()
  @Output() deleteJunta = new EventEmitter<Junta>()

  readonly displayedColumns = [
    'name',
    'amount',
    'slots',
    'dates',
    'status',
    'actions',
  ]

  onView(junta: Junta) {
    this._navigation.goToJuntaDetails(junta.id)
  }

  onEdit(junta: Junta) {
    this.editJunta.emit(junta)
  }

  onDelete(junta: Junta) {
    this.deleteJunta.emit(junta)
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }
}
