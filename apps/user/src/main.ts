import { RabbitService } from '@app/shared';
import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
