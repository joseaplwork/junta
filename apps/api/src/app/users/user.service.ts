import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User } from './user.entity'
import { UserPayload } from './user.interface'

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

  findAll(): Promise<User[]> {
    return this.usersRepository.find()
  }

  update(user: User): Promise<User> {
    return this.usersRepository.save(user)
  }
}
