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
  searchEx(params: any): Observable<any> {
    return this.commonService.get('Import/SearchEX', params);
  }

  getall(): Observable<any> {
    return this.commonService.get('Import/GetAll');
  }
  getDataDetails(id: string): Observable<any> {
    return this.commonService.get(`Import/GetListTicketDetails/${id}`);
  }

  createImport(params: any): Observable<any> {
    return this.commonService.post('Import/Create', params);
  }

  updateImport(params: any): Observable<any> {
    return this.commonService.put('Import/UpdateTicket', params);
  }

  exportExcelImport(params: any): Observable<any> {
    return this.commonService.downloadFile('Import/Export', params);
  }

  deleteImport(id: string | number): Observable<any> {
    return this.commonService.delete(`Import/Delete/${id}`);
  }
}
