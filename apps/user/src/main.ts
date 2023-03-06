import { RabbitService } from '@app/shared';
import { Service } from '@app/shared/common/const';
import { NestFactory } from '@nestjs/core';
import { ClientOptions } from '@nestjs/microservices';
import { UserModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  const rmqService = app.get<RabbitService>(RabbitService);
  const options: ClientOptions = rmqService.getOptions(Service.USER);
  app.connectMicroservice(options);
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
