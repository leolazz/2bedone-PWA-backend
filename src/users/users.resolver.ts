import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GqlJwtAuthGuard } from '../auth/gql-jwt-auth.guard';
import { User } from '../dal/entity/user.entity';
import { UserId } from './user.decorator';
import { UsersService } from './users.service';

@UseGuards(GqlJwtAuthGuard)
@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User, { nullable: true })
  public async me(@UserId() userId): Promise<User> {
    return await this.usersService.getUser(userId);
  }
}
