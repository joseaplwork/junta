import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { API_PREFIX } from '@junta/contracts'

import { environment } from '../../../environments/environment'

/** Promise-based HTTP wrapper. Resource clients in this folder are its only callers. */
@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly _http = inject(HttpClient)
  private readonly _baseUrl = `${environment.apiUrl}/${API_PREFIX}`

  get<T>(path: string): Promise<T> {
    return firstValueFrom(this._http.get<T>(this.url(path)))
  }

  url(path: string): string {
    return `${this._baseUrl}/${path}`
  }
}
