import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GqlJwtAuthGuard } from '../auth/gql-jwt-auth.guard';
import { User } from '../dal/entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async getUser(userId: any) {
    return await this.usersRepository.findOne({ id: userId });
  }
  public async findOne(email: string) {
    return await this.usersRepository.findOne({ email });
  }
}
