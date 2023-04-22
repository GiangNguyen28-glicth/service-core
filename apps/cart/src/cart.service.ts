import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartModel } from './schema/cart.schema';
import { CartDTO, ItemDTO } from './dto/cart.dto';
import { Service, throwIfNotExists } from 'libs/shared';
import { ClientRMQ } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: CartModel,
    @Inject(Service.PRODUCT) private clientProduct: ClientRMQ,
  ) {}

  async create(cart_dto: CartDTO): Promise<Cart> {
    const cart = await this.cartModel.create(cart_dto);
    return cart;
  }

  async findOne(user_id: number): Promise<Cart> {
    const cart = await this.cartModel.findOne({ user_id });
    if (!cart) {
      return await this.create({ user_id });
    }
    if (cart.items.length > 0) {
      // const pi_ids = cart.items.forEach(item => item.product_id);
      // const product_items = await lastValueFrom(
      //   this.clientProduct.send('find_all', cart),
      // );
    }
    return cart;
  }

  async addItem(item_dto: ItemDTO): Promise<Cart> {
    try {
      const { quantity, product_id, user_id } = item_dto;
      const cart = await this.cartModel.findOneAndUpdate(
        { user_id },
        { $push: { items: { quantity, product_id } } },
      );
      throwIfNotExists(cart, 'Cart not found');
      return cart;
    } catch (error) {
      throw error;
    }
  }
}
