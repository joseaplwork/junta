import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { AdminSession } from '@/admin/shared/services/admin-session'
import { Config } from '@/admin/shared/services/config'

@Injectable({
  providedIn: 'root',
})
export class Logout {
  private readonly _http = inject(HttpClient)
  private readonly _config = inject(Config)
  private readonly _session = inject(AdminSession)

  async endSession(): Promise<void> {
    await this._requestLogout()

    this._session.endSessionAndRedirect()
  }

  private async _requestLogout(): Promise<void> {
    await firstValueFrom(
      this._http.get(`${this._config.api.auth}/logout`, {
        withCredentials: true,
      }),
    )
  }
}
