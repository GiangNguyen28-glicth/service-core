import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
import { getAuthClient, RabbitClient } from 'libs/shared';
import { Client } from '../common/const';
@Injectable()
export class RabbitService {
  private clientRb: RabbitClient;
  constructor(private readonly configService: ConfigService) {}

  async connect() {
    const { username, password, host, port } = getAuthClient(
      this.configService,
      Client.RMQ,
    );
    const url = `amqp://${username}:${password}@${host}:${port}`;
    this.clientRb = new RabbitClient({
      urls: [url],
      noAck: false,
    });
  }

  getOptions(queue: string, noAck = false): RmqOptions {
    const { username, password, host, port } = getAuthClient(
      this.configService,
      Client.RMQ,
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
