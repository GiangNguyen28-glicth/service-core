import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Service } from 'libs/shared';

export function getAllConfigService(service_list) {
  const config_list = [];
  for (const service in service_list) {
    const config = {
      name: Service[service],
      useFactory: (configService: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          urls: [configService.get<string>('URL_RMQ')],
          queue: configService.get<string>(`RMQ_${service}_QUEUE`),
        },
      }),
      inject: [ConfigService],
    };
    console.log(config);
    config_list.push(config);
  }
  return config_list;
}
