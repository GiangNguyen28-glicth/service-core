import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { Cart, ItemDTO } from 'apps/cart';
import { User } from 'apps/user';
import { CurrentUser, Service } from 'libs/shared';
import { lastValueFrom } from 'rxjs';
import { AtGuard } from '../common';

@Controller('carts')
@UseGuards(AtGuard)
export class CartController {
  constructor(@Inject(Service.CART) private clientCart: ClientRMQ) {}

  @Get()
  async findOne(@CurrentUser() user: User): Promise<Cart> {
    const cart = await lastValueFrom(this.clientCart.send('get_cart', user.id));
    return cart;
  }

  @Post()
  async addItem(
    @CurrentUser() user: User,
    @Body() item_dto: ItemDTO,
  ): Promise<Cart> {
    item_dto.user_id = user.id;
    const cart = await lastValueFrom(
      this.clientCart.send('add_item_to_cart', item_dto),
    );
    return cart;
  }
}
