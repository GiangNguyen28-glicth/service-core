import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, ClientsModule, Transport } from '@nestjs/microservices';
import { getAuthClient } from '../utils/utils';
import { Client } from './const/const';
import {
  IAuthenticationClient,
  IClientDynamicModule,
  IServiceConfig,
} from './interfaces/common.interfaces';

function mappingClient(client: string, authentication: IAuthenticationClient) {
  let options = {};
  const { username, password, host, port, queue } = authentication;
  switch (client) {
    case Client.RMQ:
      return (options = {
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${username}:${password}@${host}:${port}`],
          queue: queue,
          queueOptions: {
            durable: true,
          },
        },
      });
    case Client.REDIS:
      return (options = {
        transport: Transport.REDIS,
        options: {
          url: `redis://user:password@${host}:${port}`,
        },
      });
    default:
      break;
  }
}

export function register(
  clientModule: IClientDynamicModule,
  serviceConfig: IServiceConfig,
): DynamicModule {
  return {
    module: clientModule.module,
    imports: [
      ClientsModule.registerAsync([
        {
          name: serviceConfig.service,
          useFactory: async (configService: ConfigService): Promise<any> => {
            const authenticationClient: IAuthenticationClient = getAuthClient(
              configService,
              serviceConfig.client,
            );
            if (serviceConfig.client === Client.RMQ) {
              authenticationClient.queue = configService.get<string>(
                `RABBIT_MQ_${serviceConfig.service}_QUEUE`,
              );
            }
            const options: ClientOptions = mappingClient(
              serviceConfig.client,
              authenticationClient,
            ) as ClientOptions;
            return options;
          },
          inject: clientModule.inject,
        },
      ]),
    ],
    exports: clientModule.exports,
  };
}
