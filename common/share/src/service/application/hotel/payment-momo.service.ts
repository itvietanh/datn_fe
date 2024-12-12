import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';


@Injectable({
  providedIn: 'root'
})
export class PaymentMomoService extends BaseService {
  protected override prefix = 'payment-momo';

  public createPaymentMomo<T = any>(body: any = null) {
    return this.http.post<ResponseModel<T>>(`${this.baseUrl}`, body);
  }

}