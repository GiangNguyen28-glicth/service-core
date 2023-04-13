import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user.service';
import {
  RabbitModule,
  RedisModule,
  Service,
  TypeOrmSQLModule,
} from 'libs/shared';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entities';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/user/.env',
    }),
    TypeOrmModule.forFeature([User]),
    TypeOrmSQLModule,
    RabbitModule.register({ name: Service.USER }),
    RedisModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
