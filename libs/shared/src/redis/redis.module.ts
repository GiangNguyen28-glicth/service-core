import { CacheModule, Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigService } from '@nestjs/config';
import { IAuthenticationClient } from '../common/interfaces/common';
import { getAuthClient } from '../utils/utils';
import { Client } from '../common/const';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: async (configService: ConfigService) => {
        const authentication: IAuthenticationClient = getAuthClient(
          configService,
          Client.REDIS,
        );
        return {
          store: redisStore,
          url: `redis://${authentication.host}:${authentication.port}`,
          username: authentication.username,
          password: authentication.password,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
