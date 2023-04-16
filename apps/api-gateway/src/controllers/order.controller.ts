import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { CreateOrderDTO, Order } from 'apps/order';
import { User } from 'apps/user';
import { CurrentUser, Service } from 'libs/shared';
import { lastValueFrom } from 'rxjs';
import { AtGuard } from '../common';

@Controller('orders')
export class OrderController {
  constructor(@Inject(Service.ORDER) private clientOrder: ClientRMQ) {}

  @UseGuards(AtGuard)
  @Post()
  async create(
    @Body() order_dto: CreateOrderDTO,
    @CurrentUser() user: User,
  ): Promise<Order> {
    try {
      order_dto.order_by = user.id;
      const order = await lastValueFrom(
        this.clientOrder.send('create_order', order_dto),
      );
      return order;
    } catch (error) {
      throw error;
    }
  }
}
