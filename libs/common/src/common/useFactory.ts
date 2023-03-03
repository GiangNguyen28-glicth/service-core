import { DynamicModule, Logger } from '@nestjs/common';
import {
    ClientOptions,
    ClientProxyFactory,
    ClientsModule,
} from '@nestjs/microservices';
import moment from 'moment-timezone';
import { IClientDynamicModule, IServiceConfig } from './interfaces/common';

export async function connectToService(
    serviceConfig: IServiceConfig,
    logger: Logger,
    options: ClientOptions,
) {
    logger.log(`${serviceConfig.service} connecting to ${serviceConfig.client} server...`);
    const client = ClientProxyFactory.create(options);
    const connectToRmq = async () => {
        try {
            await client.connect();
            logger.log(`Connected to RMQ server`);
        } catch (error) {
            logger.error(`Connect failed at ${moment(new Date()).tz('Asia/Ho_Chi_Minh')}`);
            setTimeout(connectToRmq.bind(this), 3000);
        }
    };
    await connectToRmq();
}

export async function register(
    clientModule: IClientDynamicModule,
    serviceConfig: IServiceConfig,
    options: ClientOptions,
): Promise<DynamicModule> {
    const logger = new Logger(clientModule.module.name);
    return {
        module: clientModule.module,
        imports: [
            ClientsModule.registerAsync([
                {
                    serviceConfig.name,
                    useFactory: async (): Promise<any> => {
                        const client = await connectToService(serviceConfig, logger, options);
                        return client;
                    },
                    inject: clientModule.inject,
                },
            ]),
        ],
        exports: clientModule.exports,
    };
}