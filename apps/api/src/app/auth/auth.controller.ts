import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Request, Response } from 'express'

import {
  AccessTokenResponse,
  ApiResource,
  AuthProfileResponse,
} from '@junta/contracts'

import { AuthenticatedAdmin } from '@/api/common/auth/authenticated-admin'
import { CurrentAdmin } from '@/api/common/decorators/current-admin.decorator'
import { Public } from '@/api/common/decorators/public.decorator'

import { AuthService } from './auth.service'
import { IssuedTokens } from './auth.types'
import { LocalAuthGuard } from './guards/local-auth.guard'
import {
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from './refresh-token.cookie'

@Controller(ApiResource.auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @CurrentAdmin() admin: AuthenticatedAdmin,
    @Res({ passthrough: true }) response: Response,
  ): AccessTokenResponse {
    return this.startSession(response, this.authService.issueTokens(admin))
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessTokenResponse> {
    const tokens = await this.authService.refresh(
      request.cookies?.[REFRESH_TOKEN_COOKIE],
    )

    return this.startSession(response, tokens)
  }

  @Get('profile')
  profile(@CurrentAdmin() admin: AuthenticatedAdmin): AuthProfileResponse {
    return {
      id: admin.id,
      email: admin.email,
      roles: admin.roles,
      permissions: admin.permissions,
    }
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) response: Response): void {
    response.clearCookie(REFRESH_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE_OPTIONS)
  }

  private startSession(
    response: Response,
    tokens: IssuedTokens,
  ): AccessTokenResponse {
    response.cookie(
      REFRESH_TOKEN_COOKIE,
      tokens.refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS,
    )

    return { accessToken: tokens.accessToken }
  }
}
