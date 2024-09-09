import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';

@Injectable({
  providedIn: 'root'
})
export class IdentityTypeService extends BaseService {
  protected override prefix = 'categories/identity-types';

  public getComboboxById<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/options-by-id`, {
      params: this.stringifyParams(params),
    });
  }
}
