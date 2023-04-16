import { Controller } from '@nestjs/common';
import { CreateProductDTO } from '../dto';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ProductService } from '../services';

@Controller()
export class ProductController {
  constructor(private productService: ProductService) {}
  @EventPattern('create_product')
  create(@Payload() product_dto: CreateProductDTO, @Ctx() ctx: RmqContext) {
    return this.productService.create(product_dto, ctx);
  }
}
