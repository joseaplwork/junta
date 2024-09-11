import {
  Controller,
  Get,
  Request as NestRequest,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';

import { Admin } from '@server/admins/admin.entity';
import { Public, Roles } from '@server/decorators';
import { Role } from '@server/enums';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

interface RequestWithUser extends Request {
  user: Admin;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Res() res: Response, @NestRequest() req: RequestWithUser) {
    const { accessToken, refreshToken } = this.authService.login(req.user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return res.send({ accessToken });
  }

  @Public()
  @Post('refresh')
  async refresh(@Res() res: Response, @Req() req: Request) {
    const oldRefreshToken = req.cookies.refreshToken;

    const user = await this.authService.decodeRefreshToken(oldRefreshToken);
    const newAccessToken = this.authService.createAccessToken({
      username: user.id,
      sub: user.id,
    });
    const newRefreshToken = this.authService.createRefreshToken({
      username: user.id,
      sub: user.id,
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return res.send({ accessToken: newAccessToken });
  }

  @Get('profile')
  @Roles(Role.Admin)
  getProfile(@NestRequest() req: RequestWithUser) {
    return req.user;
  }

  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('refreshToken', '', { expires: new Date() });
  }
}
