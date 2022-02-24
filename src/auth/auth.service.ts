import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../dal/entity/user.entity';

import { UsersService } from '../users/users.service';
import { Payload } from './payload.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async register(email: string, password: string) {
    const existingUser = await this.usersService.findOne(email);
    if (existingUser) {
      return null;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    console.log(hashedPassword);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
    });
    await this.usersRepository.save(user);

    return this.jwtService.sign({ userId: user.id } as Payload);
  }

  public async login(password: string, email: string) {
    const user = await this.usersService.findOne(email);

    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return null;
    }
    const test = this.jwtService.sign({ userId: user.id } as Payload);

    return test;
  }
}
