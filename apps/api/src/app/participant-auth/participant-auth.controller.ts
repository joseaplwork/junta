import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'

import { ApiResource, ParticipantTokensResponse } from '@junta/contracts'

import { Public } from '@/api/common/decorators/public.decorator'

import { ParticipantLoginDto } from './dto/participant-login.dto'
import { ParticipantRegisterDto } from './dto/participant-register.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { ParticipantAuthService } from './participant-auth.service'

@Controller(ApiResource.participantAuth)
export class ParticipantAuthController {
  constructor(
    private readonly participantAuthService: ParticipantAuthService,
  ) {}

  @Public()
  @Post('register')
  register(
    @Body() dto: ParticipantRegisterDto,
  ): Promise<ParticipantTokensResponse> {
    return this.participantAuthService.register(dto)
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: ParticipantLoginDto): Promise<ParticipantTokensResponse> {
    return this.participantAuthService.login(dto)
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshTokenDto): Promise<ParticipantTokensResponse> {
    return this.participantAuthService.refresh(dto.refreshToken)
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Body() dto: RefreshTokenDto): Promise<void> {
    return this.participantAuthService.logout(dto.refreshToken)
  }
}
