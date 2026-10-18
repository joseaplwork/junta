import { IsNotEmpty, IsString } from 'class-validator'

import { ParticipantLoginRequest } from '@junta/contracts'

export class ParticipantLoginDto implements ParticipantLoginRequest {
  @IsString()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}
