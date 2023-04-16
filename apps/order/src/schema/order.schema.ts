import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IOrder } from '../interfaces/order.interfaces';
import { StateOrder } from '../const/const';
import { Model } from 'mongoose';
import { Transform } from 'class-transformer';
import { MongoID } from 'libs/shared';
import { Product } from 'apps/product';

export type OrderModel = Model<Order>;
@Schema()
export class Order implements IOrder {
  @Transform(({ value }) => value.toString())
  _id?: string;

  @Prop({ required: true })
  last_price: number;

  @Prop({
    enum: Object.values(StateOrder),
    default: StateOrder.CREATED,
    type: String,
  })
  state: StateOrder;

  @Prop({ type: MongoID, ref: Product.name })
  product_id: string;

  @Prop({ required: true })
  order_by?: number;

  @Prop({ required: true })
  quantity?: number;

  @Prop({ default: false })
  is_deleted?: boolean;

  @Prop({ default: new Date() })
  created_at?: Date;

  @Prop({ default: new Date() })
  updated_at?: Date;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
