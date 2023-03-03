import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
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
  static async register({ name }: RmqModuleOptions): Promise<any> {
    const clientModule: IClientDynamicModule = {
      module: RabbitModule,
      exports: [ClientsModule],
      inject: [ConfigService],
    };
    const serviceConfig: IServiceConfig = {
      service: name,
      client: Client.RMQ,
    };
    return await register(clientModule, serviceConfig);
  }
}
