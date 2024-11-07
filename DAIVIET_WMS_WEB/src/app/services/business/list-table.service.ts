import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ListTablesService {
  constructor(private commonService: CommonService) {}

  GetLtbTree() {
    return this.commonService.get('ListTables/GetListTablesTree')
  }
  GetLtbTreeWithMgCode(MgCode: string): Observable<any> {
    return this.commonService.get(
      `ListTables/GetListTablesTreeWithMgCode/${MgCode}`,
    )
  }

  Update(data: any) {
    return this.commonService.put('ListTables/Update', data)
  }

  Insert(data: any) {
    return this.commonService.post('ListTables/Insert', data)
  }

  UpdateOrderTree(dataTree: any) {
    return this.commonService.put('ListTables/Update-Order', dataTree)
  }

  Delete(code: string | number): Observable<any> {
    return this.commonService.delete(`ListTables/Delete/${code}`)
  }
}
