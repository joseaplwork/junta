import { Injectable, inject } from '@angular/core'

import { Api } from '@/admin/shared/services/api'

@Injectable({ providedIn: 'root' })
export class LoginData {
  private readonly _api = inject(Api)

  signIn(email: string, password: string): Promise<{ accessToken: string }> {
    return this._api.auth<{ accessToken: string }>(
      '/login',
      { email, password },
      { withCredentials: true },
    )
  }
}
