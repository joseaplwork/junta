import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { Config } from '@/admin/shared/services/config'

@Injectable({
  providedIn: 'root',
})
export class LoginData {
  private readonly _http = inject(HttpClient)
  private readonly _config = inject(Config)

  signIn(email: string, password: string): Promise<{ accessToken: string }> {
    const options = {
      withCredentials: true,
    }
    const data = {
      email,
      password,
    }

    return firstValueFrom(
      this._http.post<{ accessToken: string }>(
        `${this._config.api.auth}/login`,
        data,
        options,
      ),
    )
  }
}
