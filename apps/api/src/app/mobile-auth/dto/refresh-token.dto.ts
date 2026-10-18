import { IsNotEmpty, IsString } from 'class-validator'

import { RefreshTokenRequest } from '@junta/contracts'

export class RefreshTokenDto implements RefreshTokenRequest {
  @IsString()
  @IsNotEmpty()
  refreshToken: string
}
