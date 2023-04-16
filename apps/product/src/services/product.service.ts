import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductModel } from '../schema/product.schema';
import { CreateProductDTO } from '../dto/product.dto';
import { User } from 'apps/user';
import { RabbitService } from 'libs/shared';
import { RmqContext } from '@nestjs/microservices';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: ProductModel,
    private rabbitService: RabbitService,
  ) {}
  async create(dto: CreateProductDTO, ctx: RmqContext): Promise<Product> {
    try {
      const product = await this.productModel.create(dto);
      await product.save();
      this.rabbitService.ack(ctx);
      return product;
    } catch (error) {
      throw error;
    }
  }
}
