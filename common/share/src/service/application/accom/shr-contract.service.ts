import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';

@Injectable({
  providedIn: 'root'
})
export class ShrContractService extends BaseService {
  protected override prefix = 'shr-contract';

  public override findOne<T = any>(uuid: any) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/get`, {
      params: this.stringifyParams({ uuid: uuid }),
    });
  }

  public update<T = any>(body: any = null) {
    return this.http.put<ResponseModel<T>>(`${this.baseUrl}`, body);
  }

  public renewal<T = any>(body: any = null) {
    return this.http.post<ResponseModel<T>>(`${this.baseUrl}/renewal`, body);
  }

  public approvePayment<T = any>(body: any = null) {
    return this.http.post<ResponseModel<T>>(`${this.baseUrl}/approve-payment`, body);
  }

  public getHistoryContract<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/history-contract`, {
      params: this.stringifyParams(params),
    });
  }

  public getOptions<T = any>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/options`, {
      params: this.stringifyParams(params),
    });
  }
}
