import { RabbitService } from '@app/shared';
import { Service } from '@app/shared/common/const';
import { AbstractRepository } from '@app/shared/mongodb/abstract.repository';
import { Logger, OnModuleDestroy } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ, RmqContext } from '@nestjs/microservices';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { SignUpDTO } from './dto/user.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UserService implements OnModuleDestroy {
  protected logger: Logger;
  constructor(
    // @InjectModel(User.name) private userModel: Model<User>,
    @Inject(Service.USER) private clientUser: ClientRMQ,
    private rmqService: RabbitService,
    // @InjectConnection() private readonly connection: Connection,
  ) {
    // super(userModel, connection);
  }
  async onModuleDestroy() {
    await this.clientUser.close();
  }

  async signUp(signUpDto: SignUpDTO, context: RmqContext): Promise<boolean> {
    // const user = await this.userModel.create(signUpDto);
    const user: User = {
      _id: '1',
      username: 'giangnt',
      password: '123',
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.rmqService.ack(context);
    return user ? true : false;
  }
}
