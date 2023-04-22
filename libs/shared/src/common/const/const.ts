import * as mongoose from 'mongoose';
import { SortOrder } from 'mongoose';

export enum Language {
  VN = 'vi',
  EN = 'en',
}

export enum Client {
  RMQ = 'RMQ',
  REDIS = 'REDIS',
  TYPE_ORM = 'TYPE_ORM',
}

export enum Service {
  USER = 'USER',
  AUTH = 'AUTH',
  SAGA = 'SAGA',
  PRODUCT = 'PRODUCT',
  ORDER = 'ORDER',
  PAYMENT = 'PAYMENT',
  CART = 'CART',
}

export const MongoID = mongoose.Schema.Types.ObjectId;
export type SortQuery = { [key: string]: SortOrder };
