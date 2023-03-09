import { RabbitService } from '@app/shared';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { User } from 'apps/user/src';
import { AuthService } from './auth.service';
import { JwtPayload } from './entities/auth.entities';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private rmqService: RabbitService,
  ) {}

  @MessagePattern('generate_token')
  async generateToken(
    @Payload() user: User,
    @Ctx() ctx: RmqContext,
  ): Promise<JwtPayload> {
    const jwtPayload = await this.authService.generateTokens(
      user._id.toString(),
    );
    console.log(jwtPayload);
    this.rmqService.ack(ctx);
    return jwtPayload;
  }
}
