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
  private channelRb: Channel;
  constructor(options: RmqOptions['options']) {
    super(options);
    this.connect();
    this.channelRb = this.channel as Channel;
    console.log(this.channel);
    console.log('AAAAAAAAAA', this.channelRb);
  }

  async exchange(exchangeRb: IExchangeRb): Promise<RabbitAssertExchange> {
    const { exchange, type, options } = exchangeRb;
    return await this.channelRb.assertExchange(exchange, type, options);
  }

  async bindQueue(bindQueue: IQueueBinding) {
    const { queue, exchange, routingKey } = bindQueue;
    return await this.channelRb.bindQueue(queue, exchange, routingKey);
  }

  async assertQueue(queueOptions: IQueue): Promise<RabbitAssertQueue> {
    const { queue, options } = queueOptions;
    return await this.channelRb.assertQueue(queue, options);
  }
}
