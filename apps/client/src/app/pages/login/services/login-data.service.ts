import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { ConfigService } from '@/client/services/config.service'

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly _http = inject(HttpClient)
  private readonly _config = inject(ConfigService)

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
