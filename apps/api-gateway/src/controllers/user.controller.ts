import { Service } from '@app/shared/common/const';
import { Controller, Get, HttpException, Inject, Param } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { User } from 'apps/user';
import { catchError, lastValueFrom } from 'rxjs';

@Controller('users')
export class UserController {
  constructor(@Inject(Service.USER) private clientUser: ClientRMQ) { }

  @Get(':_id')
  async getUserById(@Param('_id') _id: string): Promise<User> {
    try {
      const user = await lastValueFrom(
        this.clientUser.send('get_user_by_id', _id).pipe(
          catchError(e => {
            console.log(e);
            throw new HttpException(e.message, e.status);
          }),
        ),
      );
      return user;
    } catch (error) {
      throw error;
    }
  }
}
