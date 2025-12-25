import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { Config } from './config'

interface RequestOptions {
  withCredentials?: boolean
  headers?: HttpHeaders
}

@Injectable({ providedIn: 'root' })
export class Api {
  private readonly _http = inject(HttpClient)
  private readonly _config = inject(Config)

  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return firstValueFrom(this._http.get<T>(this._buildUrl(endpoint), options))
  }

  post<T>(
    endpoint: string,
    payload: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return firstValueFrom(
      this._http.post<T>(this._buildUrl(endpoint), payload, options),
    )
  }

  patch<T>(
    endpoint: string,
    payload: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return firstValueFrom(
      this._http.patch<T>(this._buildUrl(endpoint), payload, options),
    )
  }

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return firstValueFrom(
      this._http.delete<T>(this._buildUrl(endpoint), options),
    )
  }

  auth<T>(
    endpoint: string,
    payload: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return firstValueFrom(
      this._http.post<T>(this._buildAuthUrl(endpoint), payload, options),
    )
  }

  private _buildUrl(endpoint: string): string {
    return `${this._config.api.url}${endpoint}`
  }

  private _buildAuthUrl(endpoint: string): string {
    return `${this._config.api.auth}${endpoint}`
  }
}
