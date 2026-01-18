import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'

import { ParticipantService } from '@/api/participants/participant.service'

import { Admin } from './admin.entity'
import { AdminPayload, AdminUpdatePayload } from './admin.interface'

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly _adminRepository: Repository<Admin>,
    private readonly _participant: ParticipantService,
  ) {}

  async createOne({
    email,
    plainPassword,
    roles,
    name,
    surname,
    phoneNumber,
  }: AdminPayload): Promise<Admin> {
    const participant = await this._participant.createOne({
      name,
      surname,
      phoneNumber,
    })
    const password = await bcrypt.hash(plainPassword, 10)
    const admin = this._adminRepository.create({
      email,
      password,
      roles,
      participant,
    })

    await this._adminRepository.save(admin)

    return admin
  }

  findOne(email: string): Promise<Admin> {
    return this._adminRepository.findOne({ where: { email } })
  }

  findOneById(id: string): Promise<Admin> {
    return this._adminRepository.findOne({
      where: { id },
      relations: ['participant'],
    })
  }

  findAll(): Promise<Admin[]> {
    return this._adminRepository.find({
      relations: ['participant'],
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

    if (admin.participant && (data.name || data.surname || data.phoneNumber)) {
      const updatedParticipant = admin.participant

      if (data.name) {
        updatedParticipant.name = data.name
      }

      if (data.surname) {
        updatedParticipant.surname = data.surname
      }

      if (data.phoneNumber) {
        updatedParticipant.phone_number = data.phoneNumber
      }

      await this._participant.save(updatedParticipant)
    }

    return this._adminRepository.save(admin)
  }

  async delete(id: string): Promise<void> {
    const admin = await this.findOneById(id)

    if (!admin) {
      throw new NotFoundException(`Admin with ID "${id}" not found`)
    }

    await this._adminRepository.remove(admin)
  }
}
