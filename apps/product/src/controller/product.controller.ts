import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { IResult, RabbitService } from 'libs/shared';
import { CreateProductDTO, FilterProductDTO } from '../dto';
import { Product } from '../schema';
import { ProductService } from '../services';

@Controller()
export class ProductController {
  constructor(
    private productService: ProductService,
    private rabbitService: RabbitService,
  ) {}
  @EventPattern('create_product')
  create(@Payload() product_dto: CreateProductDTO, @Ctx() ctx: RmqContext) {
    return this.productService.create(product_dto, ctx);
  }

  @MessagePattern('ping-product')
  async ping() {
    return 'pong';
  }

  @MessagePattern('findAll')
  async findAll(
    @Payload() filter_dto: FilterProductDTO,
    @Ctx() ctx: RmqContext,
  ): Promise<IResult<Product>> {
    const product_result = await this.productService.findAll(filter_dto);
    await this.rabbitService.ack(ctx);
    return product_result;
  }
}
