import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { ApiGateWayController } from './api-gateway.controller';
import { ApiGateWayService } from './api-gateway.service';
import { controllers } from './common/api';
import { Service } from 'libs/shared';
import { getAllConfigService } from './common/utils';
import { AtStrategy } from './common';
const service_list = Service;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/api-gateway/.env',
    }),
    ClientsModule.registerAsync(getAllConfigService(service_list)),
  ],
  controllers: [ApiGateWayController, ...controllers],
  providers: [ApiGateWayService, AtStrategy],
})
export class ApiGateWayModule {}
