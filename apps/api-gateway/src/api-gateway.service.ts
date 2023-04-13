import { Service } from '@app/shared/common/const/const';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, ClientRMQ } from '@nestjs/microservices';
import { SignUpDTO } from 'apps/user/src/dto/user.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ApiGateWayService {
  constructor(
    @Inject(Service.USER) private readonly clientServiceUser: ClientProxy,
    @Inject(Service.AUTH) private readonly clientServiceAuth: ClientRMQ,
  ) {}

  async signUp(signUpDto: SignUpDTO) {
    try {
      await lastValueFrom(this.clientServiceUser.emit('sign_up', signUpDto));
      return true;
    } catch (error) {
      throw error;
    }
  }

  async pingServiceUser() {
    try {
      const startTs = Date.now();
      const pattern = { cmd: 'ping' };
      const payload = {
        data: 'Ping To Service A',
      };
      const result = await this.clientServiceUser.send<string>(
        pattern,
        payload,
      );
      await result.subscribe();
    } catch (error) {
      throw error;
    }
  }

  async pingServiceAuth() {
    try {
      const startTs = Date.now();
      const pattern = { cmd: 'ping' };
      const payload = {
        data: 'Ping To Service Auth',
      };
      const result = await this.clientServiceAuth.send<string>(
        pattern,
        payload,
      );
      await result.subscribe();
    } catch (error) {
      throw error;
    }
  }
}
