import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ConfigModule } from '@nestjs/config';
import { RabbitModule, Service } from 'libs/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/order/.env',
    }),
    RabbitModule.register({ name: Service.ORDER }),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
