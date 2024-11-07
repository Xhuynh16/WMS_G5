import {Injectable} from '@angular/core';
import {CommonService} from '../common.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RightService {
  constructor(private commonService: CommonService) {}

  GetRightTree() {
    return this.commonService.get('Right/GetRightTree');
  }

  Update(data: any) {
    return this.commonService.put('Right/Update', data);
  }

  Insert(data: any) {
    return this.commonService.post('Right/Insert', data);
  }

  UpdateOrderTree(dataTree: any) {
    return this.commonService.put('Right/Update-Order', dataTree);
  }

  Delete(id: string | number): Observable<any> {
    return this.commonService.delete(`Right/Delete/${id}`);
  }
}
