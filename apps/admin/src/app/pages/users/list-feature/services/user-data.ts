import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { User } from '@/admin/shared/interfaces/user'
import { Config } from '@/admin/shared/services/config'

export interface UserUpdateDto {
  name?: string
  surname?: string
  phone?: string
}

export interface UserCreateDto {
  name: string
  surname: string
  phone: string
}

@Injectable({ providedIn: 'root' })
export class UserData {
  private readonly _http = inject(HttpClient)
  private readonly _config = inject(Config)

  fetchAll(): Promise<User[]> {
    return firstValueFrom(
      this._http.get<User[]>(`${this._config.api.url}/user`),
    )
  }

  create(data: UserCreateDto): Promise<User> {
    return firstValueFrom(
      this._http.post<User>(`${this._config.api.url}/user`, data),
    )
  }

  update(id: string, data: UserUpdateDto): Promise<User> {
    return firstValueFrom(
      this._http.patch<User>(`${this._config.api.url}/user/${id}`, data),
    )
  }

  delete(id: string): Promise<{ success: boolean }> {
    return firstValueFrom(
      this._http.delete<{ success: boolean }>(
        `${this._config.api.url}/user/${id}`,
      ),
    )
  }
}
