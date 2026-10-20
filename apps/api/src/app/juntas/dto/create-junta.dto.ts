import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsISO4217CurrencyCode,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
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

  @IsISO4217CurrencyCode()
  currency: string

  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  startDate: string

  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  endDate: string

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => GroupAssignmentDto)
  groups: GroupAssignmentDto[]
}
