import { RabbitService } from '@app/shared';
import { Service } from '@app/shared/common/const';
import { AbstractRepository } from '@app/shared/mongodb/abstract.repository';
import { Logger, NotFoundException, OnModuleDestroy } from '@nestjs/common';
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
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(Service.USER) private clientUser: ClientRMQ,
    private rmqService: RabbitService, // @InjectConnection() private readonly connection: Connection,
  ) {
    // super(userModel, connection);
  }
  async onModuleDestroy() {
    await this.clientUser.close();
  }

  async findOne(_id: string, context: RmqContext): Promise<User> {
    const user = await this.userModel.findOne({ _id });
    this.rmqService.ack(context);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async signIn(signUp: SignUpDTO, context: RmqContext): Promise<User> {
    const user = await this.userModel.findOne(signUp);
    this.rmqService.ack(context);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async signUp(signUpDto: SignUpDTO, context: RmqContext): Promise<boolean> {
    const user = await this.userModel.create(signUpDto);
    this.rmqService.ack(context);
    return user ? true : false;
  }
}
