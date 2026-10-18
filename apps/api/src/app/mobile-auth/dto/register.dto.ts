import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

import { RegisterRequest } from '@junta/contracts'

export class RegisterDto implements RegisterRequest {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  password: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  surname: string

  @IsString()
  @IsNotEmpty()
  phoneNumber: string
}
