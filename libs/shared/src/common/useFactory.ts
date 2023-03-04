import { DynamicModule, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientOptions,
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import * as moment from 'moment-timezone';
import { Client } from './const';
import {
  IAuthenticationClient,
  IClientDynamicModule,
  IServiceConfig,
} from './interfaces/common';

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
  const logger = new Logger(clientModule.module.name);
  return {
    module: clientModule.module,
    imports: [
      ClientsModule.registerAsync([
        {
          name: serviceConfig.service,
          useFactory: async (configService: ConfigService): Promise<any> => {
            const authenticationClient: IAuthenticationClient = {
              port: configService.get<number>(
                `PORT_CLIENT_${serviceConfig.client}`,
              ),
              host: configService.get<string>(
                `HOST_CLIENT_${serviceConfig.client}`,
              ),
              username: configService.get<string>(
                `USERNAME_CLIENT_${serviceConfig.client}`,
              ),
              password: configService.get<string>(
                `PASSWORD_CLIENT_${serviceConfig.client}`,
              ),
            };
            if (serviceConfig.client === Client.RMQ) {
              authenticationClient.queue = configService.get<string>(
                `RABBIT_MQ_${serviceConfig.service}_QUEUE`,
              );
            }
            const options: ClientOptions = mappingClient(
              serviceConfig.client,
              authenticationClient,
            ) as ClientOptions;
            console.log(options);
            const client = await ClientProxyFactory.create(options);
            const connectToClient = async () => {
              try {
                await client.connect();
                logger.log(`Connected to RMQ server`);
              } catch (error) {
                logger.error(
                  `Connect to ${serviceConfig.client} failed at ${moment(
                    new Date().toISOString(),
                  ).tz('Asia/Ho_Chi_Minh')}. Try reconnect to ${
                    serviceConfig.client
                  }`,
                );
                setTimeout(connectToClient.bind(this), 3000);
              }
            };
            await connectToClient();
            return client;
          },
          inject: clientModule.inject,
        },
      ]),
    ],
    exports: clientModule.exports,
  };
}
