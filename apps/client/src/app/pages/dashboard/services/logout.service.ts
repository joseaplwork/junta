import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { AdminSessionService, ConfigService } from '@/client/shared/services'

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  private readonly _http = inject(HttpClient)
  private readonly _config = inject(ConfigService)
  private readonly _session = inject(AdminSessionService)

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
