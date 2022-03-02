import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { Payload } from './payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true, // TODO handle expired tokens
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: Payload) {
    const user = await this.usersService.getUser(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
