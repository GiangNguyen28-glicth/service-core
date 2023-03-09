import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { JwtPayload } from 'apps/auth/src';
import { delay, of } from 'rxjs';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { SignUpDTO } from './dto/user.dto';
import { User } from './schema/user.schema';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @EventPattern('sign_up')
  signUp(
    @Payload() signUpDto: SignUpDTO,
    @Ctx() context: RmqContext,
  ): Promise<boolean> {
    return this.userService.signUp(signUpDto, context);
  }

  @MessagePattern('get_user_by_id')
  async findOne(@Payload() _id: string, @Ctx() ctx: RmqContext): Promise<User> {
    const user = this.userService.findOne(_id, ctx);
    return user;
  }

  @MessagePattern('login')
  async signIn(
    @Payload() signUp: SignUpDTO,
    @Ctx() ctx: RmqContext,
  ): Promise<User> {
    const user = await this.userService.signIn(signUp, ctx);
    console.log(':D', user);
    return user;
  }

  @MessagePattern({ cmd: 'ping' })
  ping(_: any) {
    console.log(_);
    return of('pong').pipe(delay(1000));
  }
}
