import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';


@Injectable({
  providedIn: 'root'
})
export class RoomtypeStatistics extends BaseService {
  protected override prefix = 'statistic/roomtype';

  public getDataStatisticalTrans<T = any>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}`, {
      params: this.stringifyParams(params)
    });
  }
  public getTransactionsByDate(params: any = null) {
    return this.http.get<ResponseModel<any>>(`${this.baseUrl}/total-roomtype`, {
      params: this.stringifyParams(params)
    });
  }

  public exportExcelTrans(params: any = null) {
    return this.http.get(`${this.baseUrl}/export-roomtype`, {
      params: this.stringifyParams(params),
      responseType: 'blob'
    });
  }

}
