import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartModel } from './schema/cart.schema';
import { CartDTO, ItemDTO } from './dto/cart.dto';
import { throwIfNotExists } from 'libs/shared';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: CartModel) {}

  async create(cart_dto: CartDTO): Promise<Cart> {
    const cart = await this.cartModel.create(cart_dto);
    return cart;
  }

  async findOne(user_id: number): Promise<Cart> {
    const cart = await this.cartModel.findOne({ user_id });
    if (!cart) {
      return await this.create({ user_id });
    }

    return cart;
  }

  async addItem(item_dto: ItemDTO): Promise<Cart> {
    try {
      const { quantity, product_id, user_id } = item_dto;
      await this.findOne(user_id);
      const cart = await this.cartModel.findOneAndUpdate(
        { user_id },
        { $push: { items: { quantity, product_id } } },
      );
      return cart;
    } catch (error) {
      throw error;
    }
  }
}
