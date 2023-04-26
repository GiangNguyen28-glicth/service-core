import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RabbitService } from 'libs/shared';
import { CartService } from './cart.service';
import { Cart } from './schema/cart.schema';
import { ItemDTO } from './dto/cart.dto';

@Controller()
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private rabbitService: RabbitService,
  ) {}

  @EventPattern('add_item_to_cart')
  async addToCart(
    @Payload() item_dto: ItemDTO,
    @Ctx() ctx: RmqContext,
  ): Promise<Cart> {
    try {
      const cart = await this.cartService.addItem(item_dto);
      await this.rabbitService.ack(ctx);
      return cart;
    } catch (error) {
      throw error;
    }
  }

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
