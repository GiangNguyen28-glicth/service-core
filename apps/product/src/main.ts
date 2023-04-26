import { NestFactory } from '@nestjs/core';
import { ProductModule } from './product.module';
import { RabbitService, Service } from 'libs/shared';

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);
  const rmpService = app.get<RabbitService>(RabbitService);
  const optionsRmq = rmpService.getOptions(Service.PRODUCT);
  app.connectMicroservice(optionsRmq);
  await app.startAllMicroservices();
  console.log(`Start service ${Service.PRODUCT}`);
}
bootstrap();
