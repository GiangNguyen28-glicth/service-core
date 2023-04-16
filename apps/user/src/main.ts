import { NestFactory } from '@nestjs/core';
import { ClientOptions } from '@nestjs/microservices';
import { UserModule } from './user.module';
import { RabbitService, Service } from 'libs/shared';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  const rmqService = app.get<RabbitService>(RabbitService);
  const options: ClientOptions = rmqService.getOptions(Service.USER);
  app.connectMicroservice(options);
  await app.startAllMicroservices();
  console.log(`Start service ${Service.USER}`);
  app.listen(1000);
}
bootstrap();
