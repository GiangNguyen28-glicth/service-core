import { RabbitClient, RabbitService } from 'libs/shared';
import { Service } from '@app/shared/common/const';
import { NestFactory } from '@nestjs/core';
import { ClientOptions, MicroserviceOptions } from '@nestjs/microservices';
import { UserModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  const rmqService = app.get<RabbitService>(RabbitService);
  const options: ClientOptions = rmqService.getOptions(Service.USER);
  console.log(options);
  app.connectMicroservice<MicroserviceOptions>(
    {
      strategy: new RabbitClient({
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'user',
        noAck: false,
      }),
    },
    { inheritAppConfig: true },
  );
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
