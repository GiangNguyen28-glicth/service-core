import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { delay, of } from 'rxjs';
import { SignUpDTO } from './dto/user.dto';
import { User } from './entities/user.entities';
import { UserService } from './user.service';
import { IResult, RabbitService } from 'libs/shared';
import { FilterUserDTO } from './dto';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly rabbitService: RabbitService,
  ) {}

  @EventPattern('sign_up')
  signUp(
    @Payload() signUpDto: SignUpDTO,
    @Ctx() context: RmqContext,
  ): Promise<boolean> {
    return this.userService.signUp(signUpDto, context);
  }

  @MessagePattern('get_user_by_id')
  async findOne(@Payload() _id: number, @Ctx() ctx: RmqContext): Promise<User> {
    const user = this.userService.findOne(_id, ctx);
    return user;
  }

  @MessagePattern('login')
  async signIn(
    @Payload() signUp: SignUpDTO,
    @Ctx() ctx: RmqContext,
  ): Promise<User> {
    const user = await this.userService.signIn(signUp, ctx);
    return user;
  }

  @MessagePattern('findAll')
  async findAll(
    @Payload() filter: FilterUserDTO,
    @Ctx() ctx: RmqContext,
  ): Promise<IResult<User>> {
    this.rabbitService.ack(ctx);
    return await this.userService.findAll(filter);
  }

  @MessagePattern({ cmd: 'ping' })
  ping(_: any) {
    console.log(_);
    return of('pong').pipe(delay(1000));
  }
}
