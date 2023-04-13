import { ConfigService } from '@nestjs/config';
import { Client } from '../common/const/const';
import { IAuthenticationClient } from '../common/interfaces/common.interfaces';

export function getAuthClient(
  configService: ConfigService,
  clientType: Client,
): IAuthenticationClient {
  const authenticationClient: IAuthenticationClient = {
    port: configService.get<number>(`PORT_CLIENT_${clientType}`),
    host: configService.get<string>(`HOST_CLIENT_${clientType}`),
    username: configService.get<string>(`USERNAME_CLIENT_${clientType}`),
    password: configService.get<string>(`PASSWORD_CLIENT_${clientType}`),
  };
  return authenticationClient;
}
