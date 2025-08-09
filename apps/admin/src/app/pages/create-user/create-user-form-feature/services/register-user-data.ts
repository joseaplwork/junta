import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { Config } from '@/admin/shared/services/config'

import { UserPayload } from '../interfaces/user-payload'

@Injectable({ providedIn: 'root' })
export class RegisterUserData {
  private readonly http = inject(HttpClient)
  private readonly config = inject(Config)

  create({ name, surname, phone }: UserPayload): Promise<void> {
    const data = { name, surname, phone }

    return firstValueFrom(
      this.http.post<void>(`${this.config.api.url}/user`, data),
    )
  }
}
