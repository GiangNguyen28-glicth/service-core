import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ApiGateWayModule } from './api-gateway.module';
import { AllGlobalExceptionsFilter } from './common/exceptions/exceptions';

async function bootstrap() {
  const app = await NestFactory.create(ApiGateWayModule);
  app.setGlobalPrefix('api/v1');
  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllGlobalExceptionsFilter(adapterHost));
  await app.listen(3000);
}
bootstrap();
