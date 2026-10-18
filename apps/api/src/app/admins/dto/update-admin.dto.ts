import { PartialType } from '@nestjs/mapped-types'

import { UpdateAdminRequest } from '@junta/contracts'

import { CreateAdminDto } from './create-admin.dto'

export class UpdateAdminDto
  extends PartialType(CreateAdminDto, { skipNullProperties: false })
  implements UpdateAdminRequest {}
