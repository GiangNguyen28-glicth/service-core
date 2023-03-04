import { RabbitModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/service-core/.env',
    }),
    RabbitModule.register({ name: 'APP' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
