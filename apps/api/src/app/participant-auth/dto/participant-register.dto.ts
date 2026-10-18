import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

import { ParticipantRegisterRequest } from '@junta/contracts'

export class ParticipantRegisterDto implements ParticipantRegisterRequest {
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
