import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI_LOCALHOST'),
        // uri: configService.get<string>('MONGO_URI_PRODUCTION'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MongoDBModule {}
