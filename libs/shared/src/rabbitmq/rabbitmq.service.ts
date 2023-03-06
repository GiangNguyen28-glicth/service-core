import { Injectable, LoggerService, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
import { Client } from '../common/const';
import { IAuthenticationClient } from '../common/interfaces/common';
import { getAuthClient } from '../utils/utils';
@Injectable()
export class RabbitService {
  constructor(private readonly configService: ConfigService) { }

  getOptions(queue: string, noAck = false): RmqOptions {
    const { username, password, host, port } = getAuthClient(
      this.configService,
    );
    const url = `amqp://${username}:${password}@${host}:${port}`;
    return {
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue: this.configService.get<string>(`RABBIT_MQ_${queue}_QUEUE`),
        noAck,
        persistent: true,
      },
    };
  }

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}
