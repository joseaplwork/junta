import { PartialType } from '@nestjs/mapped-types'

import { UpdateParticipantRequest } from '@junta/contracts'

import { CreateParticipantDto } from './create-participant.dto'

export class UpdateParticipantDto
  extends PartialType(CreateParticipantDto, { skipNullProperties: false })
  implements UpdateParticipantRequest {}
