import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';
import { RabbitService, Service } from 'libs/shared';

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule);
  const rabbitService = app.get<RabbitService>(RabbitService);
  const options = rabbitService.getOptions(Service.PAYMENT);
  app.connectMicroservice(options);
  app.startAllMicroservices();
  console.log(`Start service ${Service.PAYMENT}`);
}
bootstrap();
