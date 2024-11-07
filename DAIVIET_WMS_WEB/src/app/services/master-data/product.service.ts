import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CommonService} from '../common.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private commonService: CommonService) {}

  searchProduct(params: any): Observable<any> {
    return this.commonService.get('Product/Search', params);
  }

  getall(): Observable<any> {
    return this.commonService.get('Product/GetAll');
  }

  createProduct(params: any): Observable<any> {
    return this.commonService.post('Product/Insert', params);
  }

  updateProduct(params: any): Observable<any> {
    return this.commonService.put('Product/Update', params);
  }

  exportExcelProduct(params: any): Observable<any> {
    return this.commonService.downloadFile('Product/Export', params);
  }

  deleteProduct(id: string | number): Observable<any> {
    return this.commonService.delete(`Product/Delete/${id}`);
  }
}
