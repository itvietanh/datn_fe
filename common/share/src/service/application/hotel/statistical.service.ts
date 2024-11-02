import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';


@Injectable({
  providedIn: 'root'
})
export class StatisticalService extends BaseService {
  protected override prefix = 'statistic';

  /**Service */
  public getAll<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/service/all`, {
      params: this.stringifyParams(params)
    });
  }

  public getTotalRevenue<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/service/total-revenue`, {
      params: this.stringifyParams(params)
    });
  }

  public getUsageCount<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/service/service-usage-count`, {
      params: this.stringifyParams(params)
    });
  }

  public getMonthRevenue<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/service/monthly-revenue`, {
      params: this.stringifyParams(params)
    });
  }

}