import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';


@Injectable({
  providedIn: 'root'
})
export class TransitionStatistics extends BaseService {
  protected override prefix = 'transactions';

  public getAll<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/transaction/all`, {
      params: this.stringifyParams(params)
    });
  }

  public getTotalTransactions<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/transaction/total-transactions`, {
      params: this.stringifyParams(params)
    });
  }

  public getNewTransactionsThisMonth<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/transaction/new-transactions-this-month`, {
      params: this.stringifyParams(params)
    });
  }

  public getTransactionsByGuest<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/transaction/transactions-by-guest/{guest_id}`, {
      params: this.stringifyParams(params)
    });
  }
  public getTransactionsByDate<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/transactions-by-date/{date}`, {
      params: this.stringifyParams(params)
    });
  }
  public getTotalAmountByDate<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/transaction/total-amount-by-date/{date}`, {
      params: this.stringifyParams(params)
    });
  }


}
