import { Min } from 'class-validator';
import { IOrder } from '../interfaces/order.interfaces';

export class CreateOrderDTO implements IOrder {
  @Min(1000)
  last_price: number;

  product_id: string;

  @Min(1)
  quantity?: number;

  order_by?: number;
}
