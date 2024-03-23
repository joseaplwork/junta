import { randomUUID } from 'crypto';

import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Admin } from '../admins/admin.entity';
import { AdminService } from '../admins/admin.service';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.adminService.findOne(username);

    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (user && passwordValid) {
      return user;
    }

    return null;
  }

  async login(admin: Admin) {
    const payload = { username: admin.email, sub: admin.id };

    return {
      access_token: await this.createAccessToken(payload),
      refresh_token: await this.createRefreshToken(payload),
    };
  }

  async decodeRefreshToken(token: string): Promise<{ id: string }> {
    try {
      return await this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async createAccessToken(payload: { username: string; sub: string }) {
    return this.jwtService.sign(payload);
  }

  async createRefreshToken(payload: { username: string; sub: string }) {
    const tokenId = randomUUID();

    return this.jwtService.sign({ ...payload, tokenId }, { expiresIn: '7d' });
  }
}
