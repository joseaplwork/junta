import { PartialType } from '@nestjs/mapped-types'

import { UpdateAccountRequest } from '@junta/contracts'

import { CreateAccountDto } from './create-account.dto'

export class UpdateAccountDto
  extends PartialType(CreateAccountDto, { skipNullProperties: false })
  implements UpdateAccountRequest {}
