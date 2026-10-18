import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator'

import { GroupAssignment } from '@junta/contracts'

export class GroupAssignmentDto implements GroupAssignment {
  @IsOptional()
  @IsString()
  name?: string

  @IsInt()
  @Min(1)
  order: number

  @IsArray()
  @IsUUID('all', { each: true })
  participantIds: string[]
}
