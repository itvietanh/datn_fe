import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';

@Injectable({
  providedIn: 'root',
})
export class Gueststatistics extends BaseService {
  protected override prefix = 'statistic/guest';

  public getDataStatisticalTrans<T = any>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}`, {
      params: this.stringifyParams(params),
    });
  }

  public exportExcelTrans(params: any = null) {
    return this.http.get(`${this.baseUrl}/export-guest`, {
      params: this.stringifyParams(params),
      responseType: 'blob',
    });
  }
  public getGuestStatisticsByDate<T = any>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/daily`, {
      params: this.stringifyParams(params), // Sử dụng stringifyParams để định dạng đúng
    });
  }

}
