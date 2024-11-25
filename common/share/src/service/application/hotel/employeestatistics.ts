import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';


@Injectable({
  providedIn: 'root'
})
export class Employeestatistics extends BaseService {
  protected override prefix = 'statistic/employee';

  public getDataStatisticalTrans<T = any>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}`, {
      params: this.stringifyParams(params)
    });
  }

  public exportExcelTrans(params: any = null) {
    return this.http.get(`${this.baseUrl}/export-employee`, {
      params: this.stringifyParams(params),
      responseType: 'blob'
    });
  }
}