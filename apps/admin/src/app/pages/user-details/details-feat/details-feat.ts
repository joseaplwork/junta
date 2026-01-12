import { Component, OnInit, inject, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { ActivatedRoute } from '@angular/router'

import { User } from '@/admin/shared/interfaces/user'
import { Navigation } from '@/admin/shared/services/navigation'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { UserDetailsData } from './services/user-details-data'

@Component({
  selector: 'ja-user-details-feat',
  templateUrl: './details-feat.html',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatDividerModule],
})
export class DetailsFeat implements OnInit {
  private readonly _route = inject(ActivatedRoute)
  private readonly _userDetailsData = inject(UserDetailsData)
  private readonly _snackbar = inject(Snackbar)
  private readonly _navigation = inject(Navigation)

  user = signal<User | null>(null)
  loading = signal(true)
  error = signal<string | null>(null)

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id')

    if (!id) {
      this._navigation.goToUserList()
      return
    }

    this._loadUser(id)
  }

  goBack(): void {
    this._navigation.goToUserList()
  }

  private async _loadUser(id: string): Promise<void> {
    this.loading.set(true)
    this.error.set(null)

    try {
      const user = await this._userDetailsData.fetchById(id)

      this.user.set(user)
    } catch {
      this.error.set('Failed to load user')
      this._snackbar.error('Failed to load user')
    } finally {
      this.loading.set(false)
    }
  }
}
