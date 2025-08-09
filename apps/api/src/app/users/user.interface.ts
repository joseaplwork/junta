export interface UserPayload {
  name: string
  surname: string
  phoneNumber: string
}

export type UserUpdatePayload = Partial<UserPayload>
