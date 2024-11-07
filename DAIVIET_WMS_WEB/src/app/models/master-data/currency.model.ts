import {BaseFilter} from '../base.model';
export class CurrencyFilter extends BaseFilter {
  id: string = '';
  name: string = '';
  isActive?: boolean | string | null;
  SortColumn: string = '';
  IsDescending: boolean = true;
}
