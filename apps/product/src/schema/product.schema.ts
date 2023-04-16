import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProduct } from '../interfaces/product.interfaces';
import { Transform } from 'class-transformer';

export type ProductModel = Model<Product>;

@Schema()
export class Product implements IProduct {
  @Transform(({ value }) => value.toString())
  _id?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  sell_price: number;

  @Prop({ required: true })
  cate_id: string;

  @Prop()
  images: string[];

  @Prop({ required: true })
  created_by: number;

  @Prop()
  updated_by: string;

  @Prop({ default: false })
  is_deleted?: boolean;

  @Prop({ default: new Date() })
  created_at?: Date;

  @Prop({ default: new Date() })
  updated_at?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
