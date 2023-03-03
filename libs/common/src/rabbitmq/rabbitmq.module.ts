import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientOptions,
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
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
    const clientModule: IClientDynamicModule<RabbitModule> = {

    };
    return register()
  }
}
