import { Logger } from '@nestjs/common';
import { RmqOptions, ClientRMQ } from '@nestjs/microservices';
import { Channel } from 'amqplib';
import {
  IExchangeRb,
  IQueue,
  IQueueBinding,
  RabbitAssertExchange,
  RabbitAssertQueue,
} from './interfaces';
export class RabbitClient extends ClientRMQ {
  public channelRb: Channel;
  public logger: Logger;
  constructor(options: RmqOptions['options']) {
    super(options);
    this.logger = new Logger(RabbitClient.name);
  }

  async exchange(exchangeRb: IExchangeRb): Promise<RabbitAssertExchange> {
    const { exchange, type, options } = exchangeRb;
    return await this.channelRb.assertExchange(exchange, type, options);
  }

  async bindQueue(bindQueue: IQueueBinding) {
    const { queue, exchange, routingKey } = bindQueue;
    await this.exchange({ exchange, type: 'direct' });
    await this.assertQueue({ queue });
    return await this.channelRb.bindQueue(queue, exchange, routingKey);
  }

  async assertQueue(queueOptions: IQueue): Promise<RabbitAssertQueue> {
    const { queue, options } = queueOptions;
    return await this.channelRb.assertQueue(queue, options);
  }

  async connectRmq(): Promise<void> {
    try {
      if (!this.channelRb) {
        await this.connect();
        this.channelRb = this.channel as Channel;
        this.logger.log('Connect to Rmq success');
      }
    } catch (error) {
      this.logger.error('Connect to Rmq failed. Try to reconnect ...');
      setTimeout(this.connectRmq.bind(this), 3000);
    }
  }
}
