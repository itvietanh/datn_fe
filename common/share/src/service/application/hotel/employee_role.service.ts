import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';


@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseService {
  protected override prefix = 'employee_role';

  public override getPaging<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/get-list`, {
      params: this.stringifyParams(params)
    });
  }

  public override findOne<T = any>(uuid: any) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}`, {
      params: this.stringifyParams({ uuid: uuid }),
    });
  }

  public override edit<T = any>(uuid: string, body: any = null) {
    return this.http.put<ResponseModel<T>>(`${this.baseUrl}`, {
      uuid: uuid,
      ...body,
    });
  }

  public override delete<T = any>(uuid: any) {
    return this.http.delete<ResponseModel<T>>(`${this.baseUrl}`, {
      params: this.stringifyParams({ uuid: uuid }),
    });
  }



}
