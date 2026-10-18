import { PartialType } from '@nestjs/mapped-types'

import { UpdateJuntaRequest } from '@junta/contracts'

import { CreateJuntaDto } from './create-junta.dto'

export class UpdateJuntaDto
  extends PartialType(CreateJuntaDto, { skipNullProperties: false })
  implements UpdateJuntaRequest {}
