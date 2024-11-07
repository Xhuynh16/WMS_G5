import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CommonService} from '../common.service';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  constructor(private commonService: CommonService) {}

  searchSupplier(params: any): Observable<any> {
    return this.commonService.get('Suppiler/Search', params);
  }

  getall(): Observable<any> {
    return this.commonService.get('Supplier/GetAll');
  }

  createSupplier(params: any): Observable<any> {
    return this.commonService.post('Supplier/Insert', params);
  }

  updateSupplier(params: any): Observable<any> {
    return this.commonService.put('Supplier/Update', params);
  }

  exportExcelSupplier(params: any): Observable<any> {
    return this.commonService.downloadFile('Supplier/Export', params);
  }

  deleteSupplier(id: string | number): Observable<any> {
    return this.commonService.delete(`Supplier/Delete/${id}`);
  }
}
