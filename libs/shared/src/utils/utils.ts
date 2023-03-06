import { ConfigService } from '@nestjs/config';
import { Client } from '../common/const';
import { IAuthenticationClient } from '../common/interfaces/common';

export function getAuthClient(
    configService: ConfigService,
): IAuthenticationClient {
    const authenticationClient: IAuthenticationClient = {
        port: configService.get<number>(`PORT_CLIENT_${Client.RMQ}`),
        host: configService.get<string>(`HOST_CLIENT_${Client.RMQ}`),
        username: configService.get<string>(`USERNAME_CLIENT_${Client.RMQ}`),
        password: configService.get<string>(`PASSWORD_CLIENT_${Client.RMQ}`),
    };
    return authenticationClient;
}