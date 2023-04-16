import { Controller } from '@nestjs/common';
import { OrderService } from './order.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Order } from './schema/order.schema';
import { CreateOrderDTO } from './dto/order.dto';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @EventPattern('create_order')
  create(
    @Payload() order_dto: CreateOrderDTO,
    @Ctx() ctx: RmqContext,
  ): Promise<Order> {
    console.log(order_dto);
    return this.orderService.create(order_dto, ctx);
  }
}
