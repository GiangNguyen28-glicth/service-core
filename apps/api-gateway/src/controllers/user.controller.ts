import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { FilterUserDTO, User } from 'apps/user';
import { IResult, Service, ValidationMultiIdsPipe } from 'libs/shared';
import { lastValueFrom } from 'rxjs';

@Controller('users')
export class UserController {
  constructor(@Inject(Service.USER) private clientUser: ClientRMQ) {}

  @Get(':_id')
  async getUserById(@Param('id') id: number): Promise<User> {
    try {
      const user = await lastValueFrom(
        this.clientUser.send('get_user_by_id', id),
      );
      return user;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @UsePipes(new ValidationMultiIdsPipe())
  async findAll(@Query() filter: FilterUserDTO): Promise<IResult<User>> {
    try {
      const result: IResult<User> = await lastValueFrom(
        this.clientUser.send('findAll', filter),
      );
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
