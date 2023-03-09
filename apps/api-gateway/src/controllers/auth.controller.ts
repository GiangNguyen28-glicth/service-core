import { Service } from '@app/shared/common/const';
import { CurrentUser } from '@app/shared/common/decorators/current-user.decorator';
import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { JwtPayload } from 'apps/auth/src/entities/auth.entities';
import { SignUpDTO } from 'apps/user';
import { User } from 'apps/user/src';
import { lastValueFrom } from 'rxjs';
import { AtGuard } from '../common/guards/at.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(Service.AUTH) private clientAuth: ClientRMQ,
    @Inject(Service.USER) private clientUser: ClientRMQ,
  ) {}

  @Post('/signup')
  async signUp(@Body() signUp: SignUpDTO): Promise<User> {
    const user = await lastValueFrom(this.clientUser.send('sign_up', signUp));
    return user;
  }

  @Post('/login')
  async signIn(@Body() signUp: SignUpDTO): Promise<JwtPayload> {
    const user = await lastValueFrom(this.clientUser.send('login', signUp));
    if (user) {
      const jwtPayload = await lastValueFrom(
        this.clientAuth.send('generate_token', user),
      );
      return jwtPayload;
    }
  }

  @Get('current-user')
  @UseGuards(AtGuard)
  async getUserByToken(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
