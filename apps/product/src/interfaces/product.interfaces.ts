import { IEntity } from 'libs/shared';

export interface IProduct extends IEntity {
  name?: string;
  price?: number;
  sell_price?: number;
  cate_id?: string;
  images?: string[];
  created_by?: number;
  updated_by?: string;
}
