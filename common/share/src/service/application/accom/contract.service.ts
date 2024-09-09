import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';

@Injectable({
  providedIn: 'root'
})
export class ContractService extends BaseService {
  protected override prefix = 'contracts';

  public updateStatus<T = any>(id: string, preStatus: number, newStatus: number) {
    return this.http.put<ResponseModel<T>>(`${this.baseUrl}/update-status`, {
      id: id,
      preStatus: preStatus,
      status: newStatus
    });
  }

  public initialize<T = any>(body: any = null) {
    return this.http.post<ResponseModel<T>>(`${this.baseUrl}/initialize`, body);
  }

  public getPagingByAccom<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/by-accom`, {
      params: this.stringifyParams(params)
    });
  }
}
