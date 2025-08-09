import { signal } from '@angular/core'

import { User } from '@/admin/shared/interfaces/user'

export class UsersState {
  private readonly _newUser = signal<User | null>(null)

  readonly newUser = this._newUser.asReadonly()

  addNewUser(user: User) {
    this._newUser.set(user)
  }

  clearNewUser() {
    this._newUser.set(null)
  }
}
