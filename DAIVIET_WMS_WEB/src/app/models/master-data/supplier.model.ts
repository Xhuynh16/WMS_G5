import { BaseFilter } from '../base.model'
export class SupplierFilter extends BaseFilter {
  id: string = ''
  name: string = ''
  contact: string = ''
  address: string = ''
  isActive?: boolean | string | null
  SortColumn: string = ''
  IsDescending: boolean = true
}
