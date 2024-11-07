import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class TemplateOpinionService {
  constructor(private commonService: CommonService) {}

  searchTemplateOpinion(params: any): Observable<any> {
    return this.commonService.get('TemplateOpinion/Search', params)
  }

  getall(): Observable<any> {
    return this.commonService.get('TemplateOpinion/GetAll')
  }
  GetTemWithTreee(templateCode: string) {
    return this.commonService.get(
      `TemplateOpinion/GetTemplateWithTree/${templateCode}`,
    )
  }

  createTemplateOpinion(params: any): Observable<any> {
    return this.commonService.post('TemplateOpinion/Insert', params)
  }

  updateTemplateOpinion(params: any): Observable<any> {
    return this.commonService.put('TemplateOpinion/Update', params)
  }

  exportExcelTemplateOpinion(params: any): Observable<any> {
    return this.commonService.downloadFile('TemplateOpinion/Export', params)
  }

  deleteTemplateOpinion(id: string | number): Observable<any> {
    return this.commonService.delete(`TemplateOpinion/Delete/${id}`)
  }
}
