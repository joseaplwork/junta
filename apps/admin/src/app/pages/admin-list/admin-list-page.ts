import { Component, OnInit, inject, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTableModule } from '@angular/material/table'
import { RouterModule } from '@angular/router'

import { Admin } from '../../shared/interfaces/admin'

import { AdminListDataService } from './services/admin-data'

@Component({
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './admin-list-page.html',
})
export class AdminListPage implements OnInit {
  private readonly _adminListData = inject(AdminListDataService)
  displayedColumns: string[] = ['name', 'email', 'role', 'phone']
  admins = signal<Admin[]>([])
  loading = signal<boolean>(false)
  error = signal<string | null>(null)

  async ngOnInit() {
    this.loading.set(true)

    try {
      const admins = await this._adminListData.fetchAll()

      this.admins.set(admins)
    } catch (err) {
      this.error.set('Failed to load admins')
      console.error(err)
    } finally {
      this.loading.set(false)
    }
  }
}
