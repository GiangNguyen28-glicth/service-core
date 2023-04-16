import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientRMQ, RmqContext, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { RabbitService, Service } from 'libs/shared';
import { SignUpDTO } from './dto/user.dto';
import { User } from './entities/user.entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserService implements OnModuleDestroy, OnModuleInit {
  protected logger: Logger;
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(Service.USER) private clientUser: ClientRMQ,
    private rmqService: RabbitService, // @InjectConnection() private readonly connection: Connection,
  ) {}

  async onModuleInit() {
    this.rmqService.initRmq();
    await this.rmqService.clientRb.connectRmq();
  }

  async onModuleDestroy() {
    if (this.clientUser) {
      await this.clientUser.close();
    }
  }

  async findOne(id: number, context: RmqContext): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    this.rmqService.ack(context);
    // await this.rmqService.clientRb.bindQueue({
    //   queue: 'exchange-1',
    //   exchange: 'exchange',
    //   routingKey: 'key-1',
    // });
    if (!user) {
      throw new RpcException(new NotFoundException('User not found'));
    }
    return user;
  }

  async signIn(signUp: SignUpDTO, context: RmqContext): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username: signUp.username },
    });
    this.rmqService.ack(context);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async signUp(signUpDto: SignUpDTO, context: RmqContext): Promise<boolean> {
    try {
      const user = await this.userRepository.create(signUpDto);
      await this.userRepository.save(user);
      this.rmqService.ack(context);
      return user ? true : false;
    } catch (error) {
      console.log(error);
    }
  }
}
