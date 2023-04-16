import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderModel } from './schema/order.schema';
import { RmqContext } from '@nestjs/microservices';
import { RabbitService, throwIfNotExists } from 'libs/shared';
import { CreateOrderDTO } from './dto/order.dto';
import { StateOrder } from './const/const';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: OrderModel,
    private rabbitService: RabbitService,
  ) {}

  async create(order_dto: CreateOrderDTO, ctx: RmqContext): Promise<Order> {
    try {
      const order = await this.orderModel.create(order_dto);
      this.rabbitService.ack(ctx);
      return order;
    } catch (error) {}
  }

  async updateState(_id: string, state: StateOrder): Promise<Order> {
    try {
      const order = await this.orderModel.findOneAndUpdate(
        { _id },
        { $set: { state } },
      );
      if (!order) {
        throwIfNotExists(order, 'Order not found');
      }
      return order;
    } catch (error) {
      throw error;
    }
  }
}
