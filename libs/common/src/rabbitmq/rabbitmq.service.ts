import { Injectable, LoggerService, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
import { Connection } from 'amqplib';
@Injectable()
export class RabbitService implements OnModuleDestroy {
  constructor(
    private configService: ConfigService,
    private logger: LoggerService,
  ) {}

  getRmqOptions(queue: string): RmqOptions {
    const USER = this.configService.get('RABBITMQ_USER');
    const PASSWORD = this.configService.get('RABBITMQ_PASS');
    const HOST = this.configService.get('RABBITMQ_HOST');

    return {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
        noAck: false,
        queue,
        queueOptions: {
          durable: true,
        },
      },
    };
  }

  acknowledgeMessage(context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
  }
  public rabbitCon: Promise<Connection>;

  onModuleDestroy() {
    if (this.rabbitCon) {
      (async () => (await this.rabbitCon)?.close())();
    }
  }
}
