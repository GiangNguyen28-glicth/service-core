import { RabbitService } from '@app/shared';
import { Service } from '@app/shared/common/const';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RmqContext } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { SignUpDTO } from './dto/user.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private rmqService: RabbitService,
  ) {}

  async signUp(signUpDto: SignUpDTO, context: RmqContext): Promise<boolean> {
    const user = await this.userModel.create(signUpDto);
    this.rmqService.ack(context);
    return user ? true : false;
  }
}
