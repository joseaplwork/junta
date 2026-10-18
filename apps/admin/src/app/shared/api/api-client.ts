import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { API_PREFIX } from '@junta/contracts'

import { environment } from '../../../environments/environment'

export interface RequestOptions {
  /** Send cookies cross-origin. Only the auth endpoints need it (refresh cookie). */
  withCredentials?: boolean
}

/** Promise-based HTTP wrapper. Resource clients in this folder are its only callers. */
@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly _http = inject(HttpClient)
  private readonly _baseUrl = `${environment.apiUrl}/${API_PREFIX}`

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return firstValueFrom(this._http.get<T>(this.url(path), options))
  }

  post<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
    return firstValueFrom(this._http.post<T>(this.url(path), body, options))
  }

  patch<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
    return firstValueFrom(this._http.patch<T>(this.url(path), body, options))
  }

  delete(path: string, options?: RequestOptions): Promise<void> {
    return firstValueFrom(this._http.delete<void>(this.url(path), options))
  }

  url(path: string): string {
    return `${this._baseUrl}/${path}`
  }
}
