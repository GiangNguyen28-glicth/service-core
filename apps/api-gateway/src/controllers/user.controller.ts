import { Service } from '@app/shared/common/const';
import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { User } from 'apps/user';
import { lastValueFrom } from 'rxjs';

@Controller('users')
export class UserController {
  constructor(@Inject(Service.USER) private clientUser: ClientRMQ) {}

  @Get(':_id')
  async getUserById(@Param('_id') _id: string): Promise<User> {
    try {
      const user = await lastValueFrom(
        this.clientUser.send('get_user_by_id', _id),
      );
      return user;
    } catch (error) {
      throw error;
    }
  }
}
