import { Model } from 'mongoose';
import { ICategories } from '../interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MongoID } from 'libs/shared';
import { Transform } from 'class-transformer';
export type CateModel = Model<Categories>;

@Schema()
export class Categories implements ICategories {
  @Transform(({ value }) => value.toString())
  _id?: string;

  @Prop()
  name: string;

  @Prop({ max: 10 })
  level: number;

  @Prop({ required: true })
  slug: string;

  @Prop({ type: MongoID, ref: Categories.name })
  parent_id: string;

  @Prop({ default: false })
  is_deleted?: boolean;

  @Prop({ default: new Date() })
  created_at?: Date;

  @Prop({ default: new Date() })
  updated_at?: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Categories);
