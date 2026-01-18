import { DatePipe, TitleCasePipe } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatChipsModule } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon'
import { MatTableModule } from '@angular/material/table'

import { ActionConfig, ColumnConfig } from '../interfaces'

@Component({
  selector: 'ja-crud-data-table',
  templateUrl: './data-table.html',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    DatePipe,
    TitleCasePipe,
  ],
  styles: `
    .chip-success {
      --mat-chip-label-text-color: var(--app-success);
      --mat-chip-outline-color: var(--app-success);
    }
    .chip-error {
      --mat-chip-label-text-color: var(--mat-sys-error);
      --mat-chip-outline-color: var(--mat-sys-error);
    }
    .chip-warning {
      --mat-chip-label-text-color: var(--app-warning);
      --mat-chip-outline-color: var(--app-warning);
    }
    .chip-default {
      --mat-chip-label-text-color: var(--mat-sys-outline);
      --mat-chip-outline-color: var(--mat-sys-outline);
    }
    .tag-role-super-admin {
      border-color: #7c3aed;
      background-color: #ede9fe;
      color: #4c1d95;
    }
    .tag-role-admin {
      border-color: #059669;
      background-color: #d1fae5;
      color: #065f46;
    }
    .tag-role-participant {
      border-color: #0284c7;
      background-color: #e0f2fe;
      color: #0c4a6e;
    }
  `,
})
export class CrudDataTable<T extends { id: string }> {
  @Input() data: T[] = []
  @Input() columns: ColumnConfig[] = []
  @Input() actions: ActionConfig = {}
  @Input() loading = false
  @Input() error: string | null = null
  @Input() emptyMessage = 'No items found. Click the + button to create one.'
  @Input() loadingMessage = 'Loading...'

  @Output() view = new EventEmitter<T>()
  @Output() edit = new EventEmitter<T>()
  @Output() delete = new EventEmitter<T>()

  get displayedColumns(): string[] {
    const cols = this.columns.map(c => c.key)

    if (this.hasActions) {
      cols.push('actions')
    }

    return cols
  }

  get hasActions(): boolean {
    return !!(this.actions.view || this.actions.edit || this.actions.delete)
  }

  getValue(row: T, column: ColumnConfig): unknown {
    if (column.getValue) {
      return column.getValue(row)
    }

    const value = (row as Record<string, unknown>)[column.key]

    if (column.type === 'combined' && column.combineWith) {
      const secondValue = (row as Record<string, unknown>)[column.combineWith]
      const format = column.combineFormat ?? '{0} {1}'

      return format
        .replace('{0}', String(value ?? ''))
        .replace('{1}', String(secondValue ?? ''))
    }

    return value
  }

  getArrayValue(row: T, column: ColumnConfig): string[] {
    const value = this.getValue(row, column)

    if (Array.isArray(value)) {
      return value.map(v => String(v))
    }

    return []
  }

  getDateValue(row: T, column: ColumnConfig): Date | string | number | null {
    const value = this.getValue(row, column)

    if (
      value instanceof Date ||
      typeof value === 'string' ||
      typeof value === 'number'
    ) {
      return value
    }

    return null
  }

  formatCurrency(value: unknown, column: ColumnConfig): string {
    const num = Number(value)

    if (isNaN(num)) return String(value)

    return new Intl.NumberFormat(column.currencyLocale ?? 'es-MX', {
      style: 'currency',
      currency: column.currencyCode ?? 'MXN',
    }).format(num)
  }

  getChipClass(value: unknown, column: ColumnConfig): string {
    if (!column.chipColor) return 'chip-default'

    const color = column.chipColor(value)

    switch (color) {
      case 'green':
        return 'chip-success'
      case 'red':
        return 'chip-error'
      case 'yellow':
        return 'chip-warning'
      case 'gray':
      default:
        return 'chip-default'
    }
  }

  getChipLabel(value: unknown, column: ColumnConfig): string {
    if (!column.chipLabel) return String(value)

    return column.chipLabel(value)
  }

  getTagLabel(tag: string, column: ColumnConfig): string {
    if (!column.tagLabel) return tag

    return column.tagLabel(tag)
  }

  getTagClass(tag: string, column: ColumnConfig): string {
    if (!column.tagColor) {
      return 'border-primary bg-primary-container text-primary'
    }

    const color = column.tagColor(tag)

    switch (color) {
      case 'role-super-admin':
        return 'tag-role-super-admin'
      case 'role-admin':
        return 'tag-role-admin'
      case 'role-participant':
        return 'tag-role-participant'
      case 'secondary':
        return 'border-secondary bg-secondary-container text-secondary-on'
      case 'tertiary':
        return 'border-primary bg-primary-container text-primary'
      case 'error':
        return 'border-error bg-error-container text-error-on'
      case 'success':
        return 'border-success bg-success-container text-success-on'
      case 'warning':
        return 'border-warning bg-warning-container text-warning-on'
      case 'primary':
      default:
        return 'border-primary bg-primary-container text-primary'
    }
  }

  onView(row: T): void {
    this.view.emit(row)
  }

  onEdit(row: T): void {
    this.edit.emit(row)
  }

  onDelete(row: T): void {
    this.delete.emit(row)
  }
}
