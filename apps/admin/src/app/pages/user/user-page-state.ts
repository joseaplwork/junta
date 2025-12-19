import { signal } from '@angular/core'

import { User } from '@/admin/shared/interfaces/user'

export class UserState {
  private readonly _deleteUser = signal<User | null>(null)
  private readonly _userDeleted = signal<User | null>(null)
  private readonly _userCreated = signal<User | null>(null)
  private readonly _updateUser = signal<User | null>(null)
  private readonly _userUpdated = signal<User | null>(null)

  readonly deleteUser = this._deleteUser.asReadonly()
  readonly userDeleted = this._userDeleted.asReadonly()
  readonly userCreated = this._userCreated.asReadonly()
  readonly updateUser = this._updateUser.asReadonly()
  readonly userUpdated = this._userUpdated.asReadonly()

  emitDeleteUser(user: User | null): void {
    this._deleteUser.set(user)
  }

  emitUserDeleted(user: User): void {
    this._userDeleted.set(user)
  }

  emitUserCreated(user: User): void {
    this._userCreated.set(user)
  }

  emitUpdateUser(user: User | null): void {
    this._updateUser.set(user)
  }

  emitUserUpdated(user: User): void {
    this._userUpdated.set(user)
  }
}
