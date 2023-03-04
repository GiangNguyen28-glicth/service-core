import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ClientOptions,
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { Client } from '../common/const';
import {
  IClientDynamicModule,
  IServiceConfig,
} from '../common/interfaces/common';
import { register } from '../common/useFactory';
import { RabbitService } from './rabbitmq.service';
interface RmqModuleOptions {
  name: string;
}
@Global()
@Module({
  providers: [RabbitService],
  exports: [RabbitService],
})
export class RabbitModule {
  static register({ name }: RmqModuleOptions): DynamicModule {
    const clientModule: IClientDynamicModule = {
      module: RabbitModule,
      exports: [ClientsModule],
      inject: [ConfigService],
    };
    const serviceConfig: IServiceConfig = {
      service: name,
      client: Client.RMQ,
    };
    return register(clientModule, serviceConfig);
  }
}
