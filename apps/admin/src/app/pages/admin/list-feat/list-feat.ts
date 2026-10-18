import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core'

import { AdminResponse, Role } from '@junta/contracts'

import { AdminsApi } from '@/admin/shared/api/admins-api'
import {
  ActionConfig,
  ColumnConfig,
  CrudDataTable,
} from '@/admin/shared/components/crud'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { AdminPageState } from '../admin-page-state'
import { ROLE_LABELS, ROLE_TAG_COLORS } from '../constants/admin-roles'

@Component({
  selector: 'ja-admin-list-feat',
  templateUrl: './list-feat.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CrudDataTable],
})
export class ListFeat {
  private readonly _state = inject(AdminPageState)
  private readonly _adminsApi = inject(AdminsApi)
  private readonly _snackbar = inject(Snackbar)

  readonly columns: ColumnConfig<AdminResponse>[] = [
    { key: 'email', header: 'Email', type: 'text' },
    {
      key: 'roles',
      header: 'Roles',
      type: 'tags',
      tagColor: tag => ROLE_TAG_COLORS[tag as Role] ?? 'primary',
      tagLabel: tag => ROLE_LABELS[tag as Role] ?? tag,
    },
    {
      key: 'name',
      header: 'Name',
      type: 'text',
      value: admin => `${admin.participant.name} ${admin.participant.surname}`,
    },
  ]

  readonly actions: ActionConfig = { edit: true, delete: true }
  readonly admins = signal<AdminResponse[]>([])
  readonly loading = signal(false)
  readonly error = signal<string | null>(null)

  constructor() {
    void this._load()

    effect(() => {
      const created = this._state.created()

      if (created) this.admins.update(list => [...list, created])
    })

    effect(() => {
      const updated = this._state.updated()

      if (updated) {
        this.admins.update(list =>
          list.map(item => (item.id === updated.id ? updated : item)),
        )
      }
    })

    effect(() => {
      const deleted = this._state.deleted()

      if (deleted) {
        this.admins.update(list => list.filter(item => item.id !== deleted.id))
      }
    })
  }

  edit(admin: AdminResponse): void {
    this._state.requestUpdate(admin)
  }

  remove(admin: AdminResponse): void {
    this._state.requestDelete(admin)
  }

  private async _load(): Promise<void> {
    this.loading.set(true)
    this.error.set(null)

    try {
      this.admins.set(await this._adminsApi.list())
    } catch {
      this.error.set('Failed to load admins')
      this._snackbar.error('Failed to load admins')
    } finally {
      this.loading.set(false)
    }
  }
}
