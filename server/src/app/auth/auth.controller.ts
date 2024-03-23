import {
  Controller,
  Get,
  Request as NestRequest,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { Admin } from '../admins/admin.entity';
import { Public } from '../decorators/is-public.decorator';

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
  async login(@Res() res: Response, @NestRequest() req: RequestWithUser) {
    const { access_token, refresh_token } = await this.authService.login(
      req.user,
    );

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return res.send({ access_token });
  }

  @Public()
  @Post('refresh')
  async refresh(@Res() res: Response, @Req() req: Request) {
    const oldRefreshToken = req.cookies.refresh_token;

    const user = await this.authService.decodeRefreshToken(oldRefreshToken);
    const newAccessToken = await this.authService.createAccessToken({
      username: user.id,
      sub: user.id,
    });
    const newRefreshToken = await this.authService.createRefreshToken({
      username: user.id,
      sub: user.id,
    });

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return res.send({ access_token: newAccessToken });
  }

  @Get('profile')
  public getProfile(@NestRequest() req: RequestWithUser) {
    return req.user;
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('refresh_token', '', { expires: new Date() });
  }
}
