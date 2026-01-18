import { Signal } from '@angular/core'

export interface Profile {
  email: Signal<string>
  permissions: Signal<string[]>
  roles: Signal<string[]>
}

export interface ProfileDTO {
  id: string
  email: string
  phone: string
  permissions: string[]
  roles: string[]
}
