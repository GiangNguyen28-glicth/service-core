import { NestFactory } from '@nestjs/core';
import { SagaModule } from './saga.module';
import { RabbitService, Service } from 'libs/shared';
import { ClientOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(SagaModule);
  const rmqService = app.get<RabbitService>(RabbitService);
  const options: ClientOptions = rmqService.getOptions(Service.SAGA);
  app.connectMicroservice(options);
  app.startAllMicroservices();
  console.log(`Start service ${Service.SAGA}`);
}
bootstrap();
