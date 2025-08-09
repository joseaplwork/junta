import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { Admin } from '@/admin/shared/interfaces/admin'
import { Config } from '@/admin/shared/services/config'

export interface AdminUpdateDto {
  email?: string
  roles?: string[]
}

export interface AdminCreateDto {
  email: string
  password: string
  roles: string[]
}

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  private readonly _http = inject(HttpClient)
  private readonly _config = inject(Config)

  fetchAll(): Promise<Admin[]> {
    return firstValueFrom(
      this._http.get<Admin[]>(`${this._config.api.url}/admin`),
    )
  }

  create(data: AdminCreateDto): Promise<Admin> {
    return firstValueFrom(
      this._http.post<Admin>(`${this._config.api.url}/admin`, data),
    )
  }

  update(id: string, data: AdminUpdateDto): Promise<Admin> {
    return firstValueFrom(
      this._http.patch<Admin>(`${this._config.api.url}/admin/${id}`, data),
    )
  }

  delete(id: string): Promise<{ success: boolean }> {
    return firstValueFrom(
      this._http.delete<{ success: boolean }>(
        `${this._config.api.url}/admin/${id}`,
      ),
    )
  }
}
