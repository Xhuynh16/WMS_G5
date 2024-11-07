import {Injectable} from '@angular/core';
import {CommonService} from '../common.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpinionListService {
  constructor(private commonService: CommonService) {}

  GetOplTree() {
    return this.commonService.get('OpinionList/GetOpinionListTree');
  }

  Update(data: any) {
    return this.commonService.put('OpinionList/Update', data);
  }

  Insert(data: any) {
    return this.commonService.post('OpinionList/Insert', data);
  }

  UpdateOrderTree(dataTree: any) {
    return this.commonService.put('OpinionList/Update-Order', dataTree);
  }

  Delete(code: string | number): Observable<any> {
    return this.commonService.delete(`OpinionList/Delete/${code}`);
  }
}
