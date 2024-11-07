import {BaseFilter} from '../base.model';
export class ImportFilter extends BaseFilter {
  id: string = '';
  name: string = '';
  status: string = '';
  productCode: string = '';
  isActive?: boolean | string | null;
  SortColumn: string = '';
  IsDescending: boolean = true;
}
