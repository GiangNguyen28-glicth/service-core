import { IsOptional, Min } from 'class-validator';
import { IProduct } from '../interfaces';

export class CreateProductDTO implements IProduct {
  name: string;

  @Min(1000)
  price: number;

  @Min(1000)
  sell_price: number;

  cate_id: string;

  @IsOptional()
  images: string[];

  created_by: number;
}
