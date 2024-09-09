import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';

@Injectable({
  providedIn: 'root'
})
export class AccommodationsService extends BaseService {
  protected override prefix = 'accommodations';

  public getChildrenPaging<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/children`, {
      params: this.stringifyParams(params)
    });
  }
}

