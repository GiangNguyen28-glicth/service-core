import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientOptions,
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
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
    const logger = new Logger(RabbitModule.name);
    return {
      module: RabbitModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: async (configService: ConfigService): Promise<any> => {
              const options: ClientOptions = {
                transport: Transport.RMQ,
                options: {
                  urls: ['amqp://guest:guest@localhost:56721'],
                  queue: configService.get<string>(`RABBIT_MQ_${name}_QUEUE`),
                },
              };
              logger.log(`Connecting to RMQ server...`);
              const client = ClientProxyFactory.create(options);
              const connectToRmq = async () => {
                try {
                  await client.connect();
                  logger.log(`Connected to RMQ server`);
                } catch (error) {
                  logger.error(`Connect failed at ${new Date()}`);
                  setTimeout(connectToRmq.bind(this), 3000);
                }
              };
              await connectToRmq();
              return client;
            },
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
