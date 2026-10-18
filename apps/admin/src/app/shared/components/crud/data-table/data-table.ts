import { DatePipe } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatChipsModule } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon'
import { MatTableModule } from '@angular/material/table'

import { formatMoney } from '@/admin/shared/pipes/money-pipe'

import { ActionConfig, ChipColor, ColumnConfig, TagColor } from '../interfaces'

const CHIP_CLASSES: Record<ChipColor, string> = {
  green: 'chip-success',
  red: 'chip-error',
  yellow: 'chip-warning',
  gray: 'chip-default',
}

const TAG_CLASSES: Record<TagColor, string> = {
  primary: 'border-primary bg-primary-container text-primary',
  purple: 'tag-purple',
  green: 'tag-green',
  blue: 'tag-blue',
}

@Component({
  selector: 'ja-crud-data-table',
  templateUrl: './data-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    DatePipe,
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
    .tag-purple {
      border-color: #7c3aed;
      background-color: #ede9fe;
      color: #4c1d95;
    }
    .tag-green {
      border-color: #059669;
      background-color: #d1fae5;
      color: #065f46;
    }
    .tag-blue {
      border-color: #0284c7;
      background-color: #e0f2fe;
      color: #0c4a6e;
    }
  `,
})
export class CrudDataTable<Row extends { id: string }> {
  readonly data = input<readonly Row[]>([])
  readonly columns = input<ColumnConfig<Row>[]>([])
  readonly actions = input<ActionConfig>({})
  readonly loading = input(false)
  readonly error = input<string | null>(null)
  readonly emptyMessage = input(
    'No items found. Click the + button to create one.',
  )
  readonly loadingMessage = input('Loading...')

  readonly view = output<Row>()
  readonly edit = output<Row>()
  readonly delete = output<Row>()

  readonly hasActions = computed(() => {
    const { view, edit, delete: remove } = this.actions()

    return Boolean(view || edit || remove)
  })

  readonly displayedColumns = computed(() => [
    ...this.columns().map(column => column.key),
    ...(this.hasActions() ? ['actions'] : []),
  ])

  value(row: Row, column: ColumnConfig<Row>): unknown {
    return column.value
      ? column.value(row)
      : (row as Record<string, unknown>)[column.key]
  }

  /** Empty for missing values, so an optional amount never shows as zero. */
  currency(row: Row, column: ColumnConfig<Row>): string {
    const raw = this.value(row, column)
    const amount = Number(raw)

    return raw === null ||
      raw === undefined ||
      raw === '' ||
      Number.isNaN(amount)
      ? ''
      : formatMoney(amount, column.currency?.(row))
  }

  isMissing(row: Row, column: ColumnConfig<Row>): boolean {
    const raw = this.value(row, column)

    return raw === null || raw === undefined
  }

  date(row: Row, column: ColumnConfig<Row>): string | null {
    const value = this.value(row, column)

    return typeof value === 'string' ? value : null
  }

  tags(row: Row, column: ColumnConfig<Row>): string[] {
    const value = this.value(row, column)

    return Array.isArray(value) ? value.map(String) : []
  }

  chipClass(value: unknown, column: ColumnConfig<Row>): string {
    return CHIP_CLASSES[column.chipColor?.(value) ?? 'gray']
  }

  chipLabel(value: unknown, column: ColumnConfig<Row>): string {
    return column.chipLabel ? column.chipLabel(value) : String(value)
  }

  tagClass(tag: string, column: ColumnConfig<Row>): string {
    return TAG_CLASSES[column.tagColor?.(tag) ?? 'primary']
  }

  tagLabel(tag: string, column: ColumnConfig<Row>): string {
    return column.tagLabel ? column.tagLabel(tag) : tag
  }
}
