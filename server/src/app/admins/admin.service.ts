import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { UserService } from '../users/user.service';

import { Admin } from './admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private userService: UserService
  ) {}

  async findOne(email: string): Promise<Admin> {
    return this.adminRepository.findOne({ where: { email } });
  }

  async createOne(
    email: string,
    plainPassword: string,
    name: string,
    surname: string,
    phone: string
  ): Promise<Admin> {
    const user = await this.userService.createOne(name, surname, phone);
    const password = await bcrypt.hash(plainPassword, 10);
    const admin = this.adminRepository.create({
      email,
      password,
      user
    });

    await this.adminRepository.save(admin);

    return admin;
  }
}
