import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'

import { UserService } from '@/api/users/user.service'

import { Admin } from './admin.entity'
import { AdminPayload, AdminUpdatePayload } from './admin.interface'

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private user: UserService,
  ) {}

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

  findOne(email: string): Promise<Admin> {
    return this.adminRepository.findOne({ where: { email } })
  }

  findOneById(id: string): Promise<Admin> {
    return this.adminRepository.findOne({
      where: { id },
      relations: ['user'],
    })
  }

  findAll(): Promise<Admin[]> {
    return this.adminRepository.find({
      relations: ['user'],
    })
  }

  async update(id: string, data: AdminUpdatePayload): Promise<Admin> {
    const admin = await this.findOneById(id)

    if (!admin) {
      throw new NotFoundException(`Admin with ID "${id}" not found`)
    }

    if (data.email) {
      admin.email = data.email
    }

    if (data.roles) {
      admin.roles = data.roles
    }

    if (admin.user && (data.name || data.surname || data.phoneNumber)) {
      const updatedUser = admin.user

      if (data.name) {
        updatedUser.name = data.name
      }

      if (data.surname) {
        updatedUser.surname = data.surname
      }

      if (data.phoneNumber) {
        updatedUser.phone_number = data.phoneNumber
      }

      await this.user.save(updatedUser)
    }

    return this.adminRepository.save(admin)
  }

  async delete(id: string): Promise<void> {
    const admin = await this.findOneById(id)

    if (!admin) {
      throw new NotFoundException(`Admin with ID "${id}" not found`)
    }

    await this.adminRepository.remove(admin)
  }
}
