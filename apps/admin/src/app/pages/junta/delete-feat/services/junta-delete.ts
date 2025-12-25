import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { Config } from '@/admin/shared/services/config'

@Injectable({ providedIn: 'root' })
export class JuntaDelete {
  private readonly _http = inject(HttpClient)
  private readonly _config = inject(Config)

  delete(id: string): Promise<{ success: boolean }> {
    return firstValueFrom(
      this._http.delete<{ success: boolean }>(
        `${this._config.api.url}/junta/${id}`,
      ),
    )
  }
}

