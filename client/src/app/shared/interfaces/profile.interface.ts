import { Signal } from '@angular/core'

export interface Profile {
  username: Signal<string>
  permissions: Signal<string[]>
  roles: Signal<string[]>
}

export interface ProfileDTO {
  id: string
  email: string
  username: string
  phone: string
  permissions: string[]
  roles: string[]
}
