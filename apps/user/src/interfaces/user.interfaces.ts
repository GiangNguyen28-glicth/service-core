import { IEntity } from 'libs/shared';

export interface IUser extends IEntity {
  username: string;
  password: string;
}
