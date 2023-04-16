import { NestFactory } from '@nestjs/core';
import { OrderModule } from './order.module';
import { RabbitService, Service } from 'libs/shared';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  const rabbitService = app.get<RabbitService>(RabbitService);
  const options = rabbitService.getOptions(Service.ORDER);
  app.connectMicroservice(options);
  app.startAllMicroservices();
  console.log(`Start service ${Service.ORDER}`);
}
bootstrap();
