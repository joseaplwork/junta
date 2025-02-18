import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'

import { UserService } from '@/server/users'

import { Admin } from './admin.entity'
import { AdminPayload } from './admin.interface'

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private user: UserService,
  ) {}

  findOne(email: string): Promise<Admin> {
    return this.adminRepository.findOne({ where: { email } })
  }

  async createOne({
    email,
    plainPassword,
    roles,
    name,
    surname,
    phoneNumber,
  }: AdminPayload): Promise<Admin> {
    const user = await this.user.createOne({
      name,
      surname,
      phoneNumber,
    })
    const password = await bcrypt.hash(plainPassword, 10)
    const admin = this.adminRepository.create({
      email,
      password,
      roles,
      user,
    })

    await this.adminRepository.save(admin)

    return admin
  }
}
