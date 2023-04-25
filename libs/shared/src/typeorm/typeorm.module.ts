import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../common/const/const';
import { IAuthenticationClient } from '../common/interfaces/common.interfaces';
import { getAuthClient } from '../utils/utils';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const authentication: IAuthenticationClient = getAuthClient(
          configService,
          Client.TYPE_ORM,
        );
        return {
          type: configService.get<string>('TYPE_SQL') as any,
          host: authentication.host,
          username: authentication.username,
          password: authentication.password,
          synchronize: true,
          autoLoadEntities: true,
          database: configService.get<string>('DATABASE') as any,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class TypeOrmSQLModule {}
