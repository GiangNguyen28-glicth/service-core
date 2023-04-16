import { Module } from '@nestjs/common';
import { SagaController } from './saga.controller';
import { SagaService } from './saga.service';
import { RabbitModule, Service } from 'libs/shared';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/saga/.env',
    }),
    RabbitModule.register({ name: Service.SAGA }),
  ],
  controllers: [SagaController],
  providers: [SagaService],
})
export class SagaModule {}
