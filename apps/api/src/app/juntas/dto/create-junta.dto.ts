import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsISO8601,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator'

import { CreateJuntaRequest } from '@junta/contracts'

import { GroupAssignmentDto } from './group-assignment.dto'

export class CreateJuntaDto implements CreateJuntaRequest {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsInt()
  @Min(1)
  amount: number

  @IsISO8601()
  startDate: string

  @IsISO8601()
  endDate: string

  @IsBoolean()
  active: boolean

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => GroupAssignmentDto)
  groups: GroupAssignmentDto[]
}
