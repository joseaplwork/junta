import { IsNotEmpty, IsString } from 'class-validator'

import { LoginRequest } from '@junta/contracts'

export class MobileLoginDto implements LoginRequest {
  @IsString()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}
