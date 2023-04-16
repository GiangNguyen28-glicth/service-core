import { IEntity } from 'libs/shared';

export interface ICategories extends IEntity {
  name?: string;
  level?: number;
  slug?: string;
  parent_id?: string;
}
