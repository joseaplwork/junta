import { Injectable, inject } from '@angular/core'

import { User, UserDTO } from '@/admin/shared/interfaces/user'
import { Api } from '@/admin/shared/services/api'

@Injectable({ providedIn: 'root' })
export class UserData {
  private readonly _api = inject(Api)

  async fetchAll(): Promise<User[]> {
    const response = await this._api.get<UserDTO[]>('/user')

    return response.map(this._transform)
  }

  private _transform = (dto: UserDTO): User => ({
    id: dto.id,
    name: dto.name,
    surname: dto.surname,
    phoneNumber: dto.phone_number,
  })
}
