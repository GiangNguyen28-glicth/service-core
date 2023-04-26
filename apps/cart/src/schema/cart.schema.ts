import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ICart, ICartItem } from '../interfaces/cart.interface';
import { Transform } from 'class-transformer';
import { Model } from 'mongoose';
import { Product } from 'apps/product';

@Schema()
export class CartItem implements ICartItem {
  @Prop({ required: true, type: String })
  product_id: string | Product;

  @Prop({ required: true })
  quantity: number;

  @Prop({ default: new Date() })
  created_at: Date;
}
export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema()
export class Cart implements ICart {
  @Transform(({ value }) => value.toString())
  _id?: string;

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: false })
  is_deleted?: boolean;

  @Prop({ default: new Date() })
  created_at?: Date;

  @Prop({ default: new Date() })
  updated_at?: Date;
}

export type CartModel = Model<Cart>;
export const CartSchema = SchemaFactory.createForClass(Cart);
