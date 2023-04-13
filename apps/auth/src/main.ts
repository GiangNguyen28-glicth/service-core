import { RabbitService, Service } from 'libs/shared';
import { NestFactory } from '@nestjs/core';
import { ClientOptions } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const rmqService = app.get<RabbitService>(RabbitService);
  const options: ClientOptions = rmqService.getOptions(Service.AUTH);
  app.connectMicroservice(options);
  await app.startAllMicroservices();
  await app.listen(3003);
}
bootstrap();
