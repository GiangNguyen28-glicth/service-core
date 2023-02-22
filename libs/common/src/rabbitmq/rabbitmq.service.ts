import { Injectable, LoggerService, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'amqplib';
@Injectable()
export class RabbitService implements OnModuleDestroy {
  public rabbitCon: Promise<Connection>;
  constructor(
    private configService: ConfigService,
    private logger: LoggerService,
  ) {
    // this.logger.setContext(RabbitService.name);
  }

  init() {}

  onModuleDestroy() {
    if (this.rabbitCon) {
      (async () => (await this.rabbitCon)?.close())();
    }
  }
}
