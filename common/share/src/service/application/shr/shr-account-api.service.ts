import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';


@Injectable({
  providedIn: 'root'
})
export class ShrAccountApiService extends BaseService {
  protected override prefix = 'shr-api-account';

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

  public deleteShrAccountApi<T = any>(body: any = null) {
    return this.http.delete<ResponseModel<T>>(`${this.baseUrl}`, body);
  }

  public getAccomCode<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/get-accom-code`, {
      params: this.stringifyParams(params),
    });
  }

  public getAccomName<T = any>(accomCode: any) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/get-accom-name`, {
      params: this.stringifyParams({ accomCode: accomCode }),
    });
  }
}