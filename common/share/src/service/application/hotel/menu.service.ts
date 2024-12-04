import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';


@Injectable({
  providedIn: 'root'
})
export class MenuService extends BaseService {
  protected override prefix = 'menu';

  public override getPaging<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/get-list`, {
      params: this.stringifyParams(params)
    });
  }

  public override findOne<T = any>(id: any) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}`, {
      params: this.stringifyParams({ id: id }),
    });
  }

  public override edit<T = any>(id: string, body: any = null) {
    return this.http.put<ResponseModel<T>>(`${this.baseUrl}`, {
      id: id,
      ...body,
    });
  }

  public override delete<T = any>(id: any) {
    return this.http.delete<ResponseModel<T>>(`${this.baseUrl}`, {
      params: this.stringifyParams({ id: id }),
    });
  }

  public override getCombobox<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/get-list-parent`, {
      params: this.stringifyParams(params),
    });
  }

}
