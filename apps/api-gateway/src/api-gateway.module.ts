import { Service } from '@app/shared/common/const/const';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApiGateWayController } from './api-gateway.controller';
import { ApiGateWayService } from './api-gateway.service';
import { AtStrategy } from './common/strategies/at.strategies';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/api-gateway/.env',
    }),
    ClientsModule.registerAsync([
      {
        name: Service.USER,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('URL_RMQ')],
            queue: configService.get<string>('RMQ_USER_QUEUE'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: Service.AUTH,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('URL_RMQ')],
            queue: configService.get<string>('RMQ_AUTH_QUEUE'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ApiGateWayController, AuthController, UserController],
  providers: [ApiGateWayService, AtStrategy],
})
export class ApiGateWayModule {}
