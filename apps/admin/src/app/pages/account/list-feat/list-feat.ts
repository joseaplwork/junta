import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core'

import { AccountResponse, Role } from '@junta/contracts'

import { AccountsApi } from '@/admin/shared/api/accounts-api'
import {
  ActionConfig,
  ColumnConfig,
  CrudDataTable,
} from '@/admin/shared/components/crud'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { AccountPageState } from '../account-page-state'
import { ROLE_LABELS, ROLE_TAG_COLORS } from '../constants/account-roles'

@Component({
  selector: 'ja-account-list-feat',
  templateUrl: './list-feat.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CrudDataTable],
})
export class ListFeat {
  private readonly _state = inject(AccountPageState)
  private readonly _accountsApi = inject(AccountsApi)
  private readonly _snackbar = inject(Snackbar)

  readonly columns: ColumnConfig<AccountResponse>[] = [
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
      value: account =>
        `${account.participant.name} ${account.participant.surname}`,
    },
  ]

  readonly actions: ActionConfig = { edit: true, delete: true }
  readonly accounts = signal<AccountResponse[]>([])
  readonly loading = signal(false)
  readonly error = signal<string | null>(null)

  constructor() {
    void this._load()

    effect(() => {
      const created = this._state.created()

      if (created) this.accounts.update(list => [...list, created])
    })

    effect(() => {
      const updated = this._state.updated()

      if (updated) {
        this.accounts.update(list =>
          list.map(item => (item.id === updated.id ? updated : item)),
        )
      }
    })

    effect(() => {
      const deleted = this._state.deleted()

      if (deleted) {
        this.accounts.update(list =>
          list.filter(item => item.id !== deleted.id),
        )
      }
    })
  }

  edit(account: AccountResponse): void {
    this._state.requestUpdate(account)
  }

  remove(account: AccountResponse): void {
    this._state.requestDelete(account)
  }

  private async _load(): Promise<void> {
    this.loading.set(true)
    this.error.set(null)

    try {
      this.accounts.set(await this._accountsApi.list())
    } catch {
      this.error.set('Failed to load accounts')
      this._snackbar.error('Failed to load accounts')
    } finally {
      this.loading.set(false)
    }
  }
}
