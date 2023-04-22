import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RabbitService } from 'libs/shared';
import { CartService } from './cart.service';
import { Cart } from './schema/cart.schema';

@Controller()
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private rabbitService: RabbitService,
  ) {}

  @MessagePattern('get_cart')
  async getCart(
    @Payload() user_id: number,
    @Ctx() ctx: RmqContext,
  ): Promise<Cart> {
    const cart = await this.cartService.findOne(user_id);
    this.rabbitService.ack(ctx);
    return cart;
  }
}
