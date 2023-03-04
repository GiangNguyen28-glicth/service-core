import { DynamicModule, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientOptions,
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import moment from 'moment-timezone';
import { IClientDynamicModule, IServiceConfig } from './interfaces/common';

export async function connectToService(
  serviceConfig: IServiceConfig,
  logger: Logger,
  options: ClientOptions,
) {
  logger.log(
    `${serviceConfig.service} connecting to ${serviceConfig.client} server...`,
  );
  const client = ClientProxyFactory.create(options);
  const connectToRmq = async () => {
    try {
      await client.connect();
      logger.log(`Connected to RMQ server`);
    } catch (error) {
      logger.error(
        `Connect failed at ${moment(new Date()).tz('Asia/Ho_Chi_Minh')}`,
      );
      setTimeout(connectToRmq.bind(this), 3000);
    }
  };
  await connectToRmq();
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
            const options: ClientOptions = {
              transport: Transport.RMQ,
              options: {
                urls: ['amqp://guest:guest@localhost:5672'],
                queue: configService.get<string>(
                  `RABBIT_MQ_${serviceConfig.service}_QUEUE`,
                ),
              },
            };
            const client = await connectToService(
              serviceConfig,
              logger,
              options,
            );
            return client;
          },
          inject: clientModule.inject,
        },
      ]),
    ],
    exports: clientModule.exports,
  };
}
