import { RabbitService } from 'libs/shared';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { User } from 'apps/user';
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
    this.rmqService.ack(ctx);
    return jwtPayload;
  }
}
