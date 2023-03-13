import { RmqOptions, ClientRMQ, ServerRMQ } from '@nestjs/microservices';

export class RabbitClient extends ServerRMQ {
  constructor(options: RmqOptions['options']) {
    super(options);
  }

  public bindQueue() {
    console.log('AAA', this.server);
  }
}
