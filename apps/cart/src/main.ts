import { NestFactory } from '@nestjs/core';
import { CartModule } from './cart.module';
import { RabbitService, Service } from 'libs/shared';

async function bootstrap() {
  const app = await NestFactory.create(CartModule);
  const rabbitService = app.get<RabbitService>(RabbitService);
  const options = rabbitService.getOptions(Service.CART);
  app.connectMicroservice(options);
  app.startAllMicroservices();
  console.log(`Start service ${Service.CART}`);
}
bootstrap();
