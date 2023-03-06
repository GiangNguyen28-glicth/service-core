import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { delay, of } from 'rxjs';
import { SignUpDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @EventPattern('sign_up')
  signUp(
    @Payload() signUpDto: SignUpDTO,
    @Ctx() context: RmqContext,
  ): Promise<boolean> {
    console.log('SignUpDto:', signUpDto);
    return this.userService.signUp(signUpDto, context);
  }

  @MessagePattern({ cmd: 'ping' })
  ping(_: any) {
    return of('pong').pipe(delay(1000));
  }
}
