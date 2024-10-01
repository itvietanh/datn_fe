import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';


@Injectable({
  providedIn: 'root'
})
export class RoomTypeService extends BaseService {
  protected override prefix = 'room-type';

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