import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';

@Injectable({
  providedIn: 'root'
})
export class EmployeeStatistics extends BaseService {
  protected override prefix = 'statistic/employees';

  public employeesStatistical<T = any>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}`, {
      params: this.stringifyParams(params)
    });
  }

  public exportExcelStatistical(params: any = null) {
    return this.http.get(`${this.baseUrl}/export-employees`, {
      params: this.stringifyParams(params),
      responseType: 'blob'
    });
  }

  public getEmployeesByDate(params: any = null) {
    return this.http.get<ResponseModel<any>>(`${this.baseUrl}/Allin`, {
      params: this.stringifyParams(params)
    });
  }
}
