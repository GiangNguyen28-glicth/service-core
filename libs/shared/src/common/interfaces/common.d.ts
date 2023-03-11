import { Client } from '../const';

interface IEntity {
  _id?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IClientDynamicModule {
  module: any;
  inject?: any[];
  exports: any[];
}
export interface IServiceConfig {
  service: string;
  client: Client;
}

export interface IAuthenticationClient {
  host: string;
  port: number;
  username: string;
  password: string;
  queue?: string;
}
