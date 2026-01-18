import {
  Controller,
  Get,
  Request as NestRequest,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Request, Response } from 'express'

import { Role } from '@junta/shared/enums/role'

import { Public } from '@/api/decorators/is-public.decorator'
import { Roles } from '@/api/decorators/roles.decorator'
import {
  RequestWithAdmin,
  RequestWithAuthenticatedAdmin,
} from '@/api/interfaces/request.interface'

import { AuthService } from './auth.service'
import { LocalAuthGuard } from './local-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly _auth: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Res() res: Response, @NestRequest() req: RequestWithAdmin) {
    const { accessToken, refreshToken } = this._auth.login(req.admin)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })

    return res.send({ accessToken })
  }

  @Public()
  @Post('refresh')
  async refresh(@Res() res: Response, @Req() req: Request) {
    const actualRefreshToken = req.cookies.refreshToken
    const admin = await this._auth.decodeRefreshToken(actualRefreshToken)
    const newAccessToken = this._auth.createAccessToken(admin)
    const newRefreshToken = this._auth.createRefreshToken(admin)

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })

    return res.send({ accessToken: newAccessToken })
  }

  @Get('profile')
  @Roles(Role.ADMIN)
  getProfile(@NestRequest() req: RequestWithAuthenticatedAdmin) {
    return req.admin
  }

  @Get('logout')
  @Roles(Role.ADMIN)
  logout(@Res() res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })

    res.send({ message: 'Cookie cleared successfully' })
  }
}
