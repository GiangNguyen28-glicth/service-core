import { IEntity } from '@app/shared/common/interfaces/common';

export interface IUser extends IEntity {
  username: string;
  password: string;
}
