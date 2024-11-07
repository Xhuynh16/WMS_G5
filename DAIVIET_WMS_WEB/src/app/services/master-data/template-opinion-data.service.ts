import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class TemplateOpinionDataService {
  constructor(private commonService: CommonService) {}

  searchTemplateOpinionData(params: any): Observable<any> {
    return this.commonService.get('TemplateOpinionData/Search', params)
  }

  getall(): Observable<any> {
    return this.commonService.get('TemplateOpinionData/GetAll')
  }

  createTemplateOpinionData(params: any[]): Observable<any> {
    return this.commonService.post('TemplateOpinionData/Insert', params)
  }

  updateTemplateOpinionData(params: any): Observable<any> {
    return this.commonService.put('TemplateOpinionData/Update', params)
  }

  exportExcelTemplateOpinionData(params: any): Observable<any> {
    return this.commonService.downloadFile('TemplateOpinionData/Export', params)
  }

  deleteTemplateOpinionData(data: {
    orgCode: string
    opinionCode: string
    templateCode: string
  }): Observable<any> {
    return this.commonService.delete(
      `TemplateOpinionData/Delete?orgCode=${data.orgCode}&opinionCode=${data.opinionCode}&templateCode=${data.templateCode}`,
    )
  }
}
