import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CommonService} from '../common.service';

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  constructor(private commonService: CommonService) {}

  searchImport(params: any): Observable<any> {
    return this.commonService.get('Import/Search', params);
  }

  getall(): Observable<any> {
    return this.commonService.get('Import/GetAll');
  }

  createImport(params: any): Observable<any> {
    return this.commonService.post('Import/Insert', params);
  }

  updateImport(params: any): Observable<any> {
    return this.commonService.put('Import/Update', params);
  }

  exportExcelImport(params: any): Observable<any> {
    return this.commonService.downloadFile('Import/Export', params);
  }

  deleteImport(id: string | number): Observable<any> {
    return this.commonService.delete(`Import/Delete/${id}`);
  }
}
