import { Injectable, inject } from '@angular/core'

import { User, UserDTO } from '@/admin/shared/interfaces/user'
import { Api } from '@/admin/shared/services/api'

@Injectable({ providedIn: 'root' })
export class UserDetailsData {
  private readonly _api = inject(Api)

  async fetchById(id: string): Promise<User> {
    const response = await this._api.get<UserDTO>(`/user/${id}`)

    return this._transform(response)
  }

  private _transform = (dto: UserDTO): User => ({
    id: dto.id,
    name: dto.name,
    surname: dto.surname,
    phoneNumber: dto.phone_number,
  })
}
