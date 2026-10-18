import { IsNotEmpty, IsString } from 'class-validator'

import { CreateParticipantRequest } from '@junta/contracts'

export class CreateParticipantDto implements CreateParticipantRequest {
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
