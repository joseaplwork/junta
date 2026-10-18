import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator'

import { CreateAdminRequest, Role } from '@junta/contracts'

export class CreateAdminDto implements CreateAdminRequest {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Role, { each: true })
  roles: Role[]

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
