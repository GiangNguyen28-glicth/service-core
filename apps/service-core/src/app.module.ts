import { RabbitModule } from '@app/common';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [RabbitModule.register({ name: 'BILLING' })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
