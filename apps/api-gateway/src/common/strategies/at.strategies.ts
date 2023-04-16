import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IJwtPayload } from '../../../../auth/src/interfaces/auth';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'apps/user/src/entities/user.entities';
import { Inject } from '@nestjs/common/decorators';
import { Service } from '@app/shared/common/const/const';
import { ClientRMQ } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(Service.USER) private clientUser: ClientRMQ,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_AT'),
    });
  }
  async validate(payload: IJwtPayload): Promise<User> {
    try {
      const user = await lastValueFrom(
        this.clientUser.send('get_user_by_id', payload.id),
      );
      if (!user) {
        throw new UnauthorizedException('jwt not accepted');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
