import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';

@Injectable({
  providedIn: 'root',
})
export class OrderRoomService extends BaseService {
  protected override prefix = 'order-room';

  public calculator<T = any>(body: any = null) {
    return this.http.post<ResponseModel<T>>(`${this.baseUrl}/calculator`, body);
  }

  public override getPaging<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/get-list`, {
      params: this.stringifyParams(params),
    });
  }

  public getListService<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/ru-service`, {
      params: this.stringifyParams(params),
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

  public hanldeRoomOverTime<T = any>(uuid: any) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/over-time`, {
      params: this.stringifyParams({ uuid: uuid }),
    });
  }

  public hanldeSearchRooms<T = any>(data: any) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/search-rooms`, {
      params: this.stringifyParams(data),
    });
  }

  public handleRoomChange<T = any>(body: any) {
    return this.http.post<ResponseModel<T>>(`${this.baseUrl}/room-change-fee`, {
      ...body,
    });
  }

}
