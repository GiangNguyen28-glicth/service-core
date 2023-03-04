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
import { connectToService, register } from '../common/useFactory';
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
      exports: [ClientsModule, RabbitService],
      inject: [ConfigService],
    };
    const serviceConfig: IServiceConfig = {
      service: name,
      client: Client.RMQ,
    };
    const logger = new Logger(clientModule.module.name);
    console.log(serviceConfig.service);
    return {
      module: RabbitModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: serviceConfig.service,
            useFactory: async (): Promise<any> => {
              const options: ClientOptions = {
                transport: Transport.RMQ,
                options: {
                  urls: ['amqp://guest:guest@localhost:5672'],
                  // queue: configService.get<string>(
                  //   `RABBIT_MQ_${serviceConfig.service}_QUEUE`,
                  // ),
                },
              };
              const client = ClientProxyFactory.create(options);

              await client.connect();

              return client;
            },
            // inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
