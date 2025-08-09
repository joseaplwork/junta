import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTableModule } from '@angular/material/table'

import { User } from '@/admin/shared/interfaces/user'

@Component({
  selector: 'app-user-list-table',
  templateUrl: './user-list-table.html',
  imports: [MatTableModule, MatButtonModule, MatIconModule],
})
export class UserListTable {
  @Input() users: User[] = []
  @Input() loading = false
  @Input() error: string | null = null

  @Output() editUser = new EventEmitter<User>()
  @Output() deleteUser = new EventEmitter<User>()

  readonly displayedColumns = ['name', 'phone', 'actions']

  onEdit(user: User) {
    this.editUser.emit(user)
  }

  onDelete(user: User) {
    this.deleteUser.emit(user)
  }
}
