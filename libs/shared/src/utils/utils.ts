import { ConfigService } from '@nestjs/config';
import { Client, Language } from '../common/const/const';
import { IAuthenticationClient } from '../common/interfaces/common.interfaces';
import { NotFoundException } from '@nestjs/common';
import slugify from 'slugify';
import { RpcException } from '@nestjs/microservices';

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

export function throwIfNotExists<T>(
  model: T | any | undefined,
  message: string,
) {
  if (!model || model?.is_deleted) {
    throw new RpcException(new NotFoundException(`${message}`));
  }
}

export function toSlug(text: string, locale?: string): string {
  if (!text) return '';
  text = text.replace('$', '').replace('%', '');
  locale = locale ? locale : Language.EN;
  return slugify(text, {
    replacement: '-',
    lower: true,
    strict: true,
    locale: locale,
    trim: true,
  });
}

export function toKeyword(text: string): string {
  if (!text) return '';
  return text.replace(/-/g, ' ');
}

export function transformTextSearch(text: string): string {
  if (!text) return '';
  text = text.replace('$', '').replace('%', '');
  text = slugify(text, {
    replacement: '-',
    lower: true,
    strict: true,
    trim: true,
  });
  return text.replace(/-/g, ' ');
}
