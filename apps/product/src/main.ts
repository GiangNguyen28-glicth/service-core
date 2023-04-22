import { NestFactory } from '@nestjs/core';
import { ProductModule } from './product.module';
import { RabbitService, Service } from 'libs/shared';

async function bootstrap() {
  console.log('DB_URL:', process.env.MONGO_URI_LOCALHOST);
  const app = await NestFactory.create(ProductModule);
  const rmpService = app.get<RabbitService>(RabbitService);
  const optionsRmq = rmpService.getOptions(Service.PRODUCT);
  console.log('Options:', optionsRmq);
  app.connectMicroservice(optionsRmq);
  console.log(`Start service ${Service.PRODUCT}`);
  await app.startAllMicroservices();
}
bootstrap();
