import { Service } from '@app/shared/common/const';
import { Inject, OnModuleDestroy } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';

@Injectable()
export class AuthService implements OnModuleDestroy {
  constructor(@Inject(Service.AUTH) private clientAuth: ClientRMQ) { }
  async onModuleDestroy() {
    await this.clientAuth.close();
  }
  getHello(): string {
    return 'Hello World!';
  }
}
