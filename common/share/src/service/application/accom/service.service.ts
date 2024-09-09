import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';

@Injectable({
  providedIn: 'root'
})
export class ServiceService extends BaseService {
  protected override prefix = 'services';

  public getByLabel<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/by-label`, {
      params: this.stringifyParams(params),
    });
  }
}
