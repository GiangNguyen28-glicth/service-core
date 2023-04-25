import { IFilterDTO } from 'libs/shared';

export class FilterUserDTO implements IFilterDTO {
  username: string;
  ids: string[];
}
