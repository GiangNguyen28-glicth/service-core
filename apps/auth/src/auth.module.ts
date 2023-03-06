import { MongoDBModule, RabbitModule } from '@app/shared';
import { Service } from '@app/shared/common/const';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
    }),
    RabbitModule.register({ name: Service.AUTH }),
    MongoDBModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
