import { NestFactory } from '@nestjs/core';
import { ApiGateWayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGateWayModule);
  app.setGlobalPrefix('api/v1');
  await app.listen(3000);
}
bootstrap();
