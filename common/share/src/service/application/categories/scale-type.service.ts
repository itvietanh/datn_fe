import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';

@Injectable({
  providedIn: 'root',
})
export class ScaleTypeService extends BaseService {
  protected override prefix = 'categories/scale-types';

  public getOptions<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/options`, {
      params: this.stringifyParams(params),
    });
  }

  public override getCombobox<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/combobox`, {
      params: this.stringifyParams(params),
    });
  }
}
