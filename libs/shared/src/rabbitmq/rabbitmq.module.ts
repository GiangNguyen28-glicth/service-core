import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { Client } from '../common/const/const';
import {
  IClientDynamicModule,
  IServiceConfig,
} from '../common/interfaces/common.interfaces';
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
