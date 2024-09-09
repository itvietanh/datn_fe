import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';

@Injectable({
  providedIn: 'root',
})
export class ContractResidentService extends BaseService {
  protected override prefix = 'contracts-residents';

  public getByAccom<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/by-accommodation`, {
      params: this.stringifyParams(params)
    });
  }

}
