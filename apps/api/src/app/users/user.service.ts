import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User } from './user.entity'
import { UserPayload, UserUpdatePayload } from './user.interface'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  createOne({ name, surname, phoneNumber }: UserPayload): Promise<User> {
    const user = this.usersRepository.create({
      name,
      surname,
      phone_number: phoneNumber,
    })

    return this.usersRepository.save(user)
  }

  findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } })
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find()
  }

  async update(id: string, data: UserUpdatePayload): Promise<User> {
    const user = await this.findOneById(id)
    if (!user) throw new NotFoundException('User not found')

    if (data.name !== undefined) user.name = data.name
    if (data.surname !== undefined) user.surname = data.surname
    if (data.phoneNumber !== undefined) user.phone_number = data.phoneNumber

    return this.usersRepository.save(user)
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOneById(id)
    if (!user) throw new NotFoundException('User not found')
    await this.usersRepository.remove(user)
  }

  save(user: User): Promise<User> {
    return this.usersRepository.save(user)
  }
}
