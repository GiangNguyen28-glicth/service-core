import { Type } from '@nestjs/common';
import { Client } from '../const/const';
import { FilterQuery, UpdateQuery } from 'mongoose';
export interface IEntity {
  _id?: string;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface IResult<T> {
  results: T[];
  totalCount: number;
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

export interface ArgumentMetadata {
  type: 'body' | 'query' | 'param' | 'custom';
  metatype?: Type<unknown>;
  data?: string;
}

export interface IFilterDTO {
  ids: string | string[];
}

export interface BaseInterfaceSchema<TDocument> {
  create(document: TDocument): Promise<TDocument>;
  findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument>;
  find(filterQuery: FilterQuery<TDocument>): any;
  findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument>;
}
