import { IEntity } from 'libs/shared';
import { StateOrder } from '../const/const';

export interface IOrder extends IEntity {
  last_price: number;
  state?: StateOrder;
  product_id: string;
  quantity?: number;
  order_by?: number;
}
