import { randomUUID } from 'crypto';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Admin } from '../admins/admin.entity';
import { AdminService } from '../admins/admin.service';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.adminService.findOne(username);

    if (user && user.password === pass) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(admin: Admin) {
    const payload = { username: admin.email, sub: admin.id };

    return {
      accessToken: await this.createAccessToken(payload),
      refreshToken: await this.createRefreshToken(payload),
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
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }

  async createRefreshToken(payload: { username: string; sub: string }) {
    const tokenId = randomUUID();

    return this.jwtService.sign({ ...payload, tokenId }, { expiresIn: '7d' });
  }
}
