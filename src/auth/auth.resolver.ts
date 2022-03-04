import { Logger, Response } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserInput } from '../users/dto/user.input';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  private logger = new Logger(AuthResolver.name);

  constructor(private authService: AuthService) {}

  @Mutation(() => String, { nullable: true })
  public async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<string> {
    this.logger.log(this.login.name);
    const accessToken = await this.authService.login(password, email);
    return accessToken;
  }

  @Mutation(() => String, { nullable: true })
  public async register(
    @Args('data')
    { email, password }: UserInput,
  ): Promise<string> {
    this.logger.log(this.register.name);

    const accessToken = await this.authService.register(email, password);
    return accessToken;
  }

  @Mutation(() => Boolean)
  public async logout(@Response() res): Promise<boolean> {
    this.logger.log(this.logout.name);

    res.cookie('access-token', '', { expires: new Date(Date.now()) });
    return true;
  }
}
