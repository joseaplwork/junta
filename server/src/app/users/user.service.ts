import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  createOne(name: string, surname: string, phonNumber: string): Promise<User> {
    const user = this.usersRepository.create({
      name,
      surname,
      phone_number: phonNumber,
    });

    return this.usersRepository.save(user);
  }
}
