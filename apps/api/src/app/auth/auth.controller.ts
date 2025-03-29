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

import { Admin } from '@/api/admins/admin.entity'
import { Public } from '@/api/decorators/is-public.decorator'
import { Roles } from '@/api/decorators/roles.decorator'

import { AuthService } from './auth.service'
import { LocalAuthGuard } from './local-auth.guard'

interface RequestWithUser extends Request {
  user: Admin
}

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Res() res: Response, @NestRequest() req: RequestWithUser) {
    const { accessToken, refreshToken } = this.auth.login(req.user)

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
    const user = await this.auth.decodeRefreshToken(actualRefreshToken)
    const newAccessToken = this.auth.createAccessToken(user)
    const newRefreshToken = this.auth.createRefreshToken(user)

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })

    return res.send({ accessToken: newAccessToken })
  }

  @Get('profile')
  @Roles(Role.ADMIN)
  getProfile(@NestRequest() req: RequestWithUser) {
    return req.user
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
