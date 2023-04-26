import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { Cart, ItemDTO } from 'apps/cart';
import { User } from 'apps/user';
import { CurrentUser, IResult, Service } from 'libs/shared';
import { lastValueFrom } from 'rxjs';
import { AtGuard } from '../common';
import { Product } from 'apps/product';

@Controller('carts')
@UseGuards(AtGuard)
export class CartController {
  constructor(
    @Inject(Service.CART) private clientCart: ClientRMQ,
    @Inject(Service.PRODUCT) private clientProduct: ClientRMQ,
  ) {}

  @Get()
  async findOne(@CurrentUser() user: User): Promise<Cart> {
    const cart: Cart = await lastValueFrom(
      this.clientCart.send('get_cart', user.id),
    );
    if (cart.items.length > 0) {
      const pi_ids = cart.items.forEach(item => item.product_id);
      const product_items: IResult<Product> = await lastValueFrom(
        this.clientProduct.send('findAll', { ids: pi_ids }),
      );
      cart.items.map(item => {
        const pi = product_items.results.filter(
          pi => pi._id.toString() == item.product_id.toString(),
        );
        item.product_id = pi[0];
      });
    }
    return cart;
  }

  @Post()
  async addItem(
    @CurrentUser() user: User,
    @Body() item_dto: ItemDTO,
  ): Promise<Cart> {
    try {
      item_dto.user_id = user.id;
      const cart: Cart = await lastValueFrom(
        this.clientCart.send('add_item_to_cart', item_dto),
      );
      return cart;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
