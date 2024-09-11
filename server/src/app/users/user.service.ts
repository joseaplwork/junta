import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { UserPayload } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  createOne({ name, surname, phoneNumber }: UserPayload): Promise<User> {
    const user = this.usersRepository.create({
      name,
      surname,
      phone_number: phoneNumber,
    });

    return this.usersRepository.save(user);
  }
}
