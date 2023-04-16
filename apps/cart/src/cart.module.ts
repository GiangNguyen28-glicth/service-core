import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ConfigModule } from '@nestjs/config';
import { RabbitModule, Service } from 'libs/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/product/.env',
    }),
    RabbitModule.register({ name: Service.CART }),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
