import { Product } from 'apps/product';
import { IEntity } from 'libs/shared';

export interface ICartItem {
  product_id: string | Product;
  quantity: number;
  created_at: Date;
}

export interface ICart extends IEntity {
  items: ICartItem[];
  user_id: string;
}
