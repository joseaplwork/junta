import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'

import { ApiResource, TokenPairResponse } from '@junta/contracts'

import { Public } from '@/api/common/decorators/public.decorator'

import { MobileLoginDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { RegisterDto } from './dto/register.dto'
import { MobileAuthService } from './mobile-auth.service'

@Controller(ApiResource.mobileAuth)
export class MobileAuthController {
  constructor(private readonly mobileAuthService: MobileAuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto): Promise<TokenPairResponse> {
    return this.mobileAuthService.register(dto)
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: MobileLoginDto): Promise<TokenPairResponse> {
    return this.mobileAuthService.login(dto)
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshTokenDto): Promise<TokenPairResponse> {
    return this.mobileAuthService.refresh(dto.refreshToken)
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Body() dto: RefreshTokenDto): Promise<void> {
    return this.mobileAuthService.logout(dto.refreshToken)
  }
}
