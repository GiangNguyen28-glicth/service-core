import { IsOptional } from 'class-validator';
import { ICategories } from '../interfaces';

export class CreateCategoryDTO implements ICategories {
  name: string;

  level: number;

  @IsOptional()
  parent_id: string;

  slug?: string;
}
