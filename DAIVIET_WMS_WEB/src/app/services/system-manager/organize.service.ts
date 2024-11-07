import {Injectable} from '@angular/core';
import {CommonService} from '../common.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrganizeService {
  constructor(private commonService: CommonService) {}

  GetOrgTree() {
    return this.commonService.get('Organize/GetOrganizeTree');
  }

  Update(data: any) {
    return this.commonService.put('Organize/Update', data);
  }

  Insert(data: any) {
    return this.commonService.post('Organize/Insert', data);
  }

  UpdateOrderTree(dataTree: any) {
    return this.commonService.put('Organize/Update-Order', dataTree);
  }

  Delete(code: string | number): Observable<any> {
    return this.commonService.delete(`Organize/Delete/${code}`);
  }
}
