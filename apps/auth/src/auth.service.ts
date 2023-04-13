import { BadRequestException, Inject, OnModuleDestroy } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientRMQ } from '@nestjs/microservices';
import { JwtPayload } from './entities/auth.entities';
import { IJwtPayload } from './interfaces/auth';
import { Service } from 'libs/shared';

@Injectable()
export class AuthService implements OnModuleDestroy {
  constructor(
    @Inject(Service.AUTH) private clientAuth: ClientRMQ,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async onModuleDestroy() {
    await this.clientAuth.close();
  }

  async decodeToken(token: string): Promise<IJwtPayload> {
    try {
      const payload = (await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      })) as IJwtPayload;
      if (!payload) {
        throw new BadRequestException("Can't decode this token");
      }
      return payload;
    } catch (error) {
      throw error;
    }
  }

  async generateTokens(_id: string): Promise<JwtPayload> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { _id },
        {
          secret: this.configService.get<string>('JWT_SECRET_AT'),
          expiresIn: `${this.configService.get<number>('JWT_EXPIRED_AT')}s`,
        },
      ),
      this.jwtService.signAsync(
        { _id },
        {
          secret: this.configService.get<string>('JWT_SECRET_RT'),
          expiresIn: `${this.configService.get<number>('JWT_EXPIRED_RT')}s`,
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }
}
