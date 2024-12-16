import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';


@Injectable({
  providedIn: 'root'
})
export class HomeHotelService extends BaseService {
  protected override prefix = 'home-hotel';

  public override getPaging<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/get-room-using-guest`, {
      params: this.stringifyParams(params)
    });
  }

  public override findOne<T = any>(uuid: any) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/get-room-using`, {
      params: this.stringifyParams({ uuid: uuid }),
    });
  }

  public getMoneyInRoom<T = any>(uuid: any) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/get-money-in-room`, {
      params: this.stringifyParams({ uuid: uuid }),
    });
  }

  public override add<T = any>(body: any = null) {
    return this.http.post<ResponseModel<T>>(`${this.baseUrl}/add-guest-room-using`, body);
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

  public guestOutRoom<T = any>(uuid: any) {
    return this.http.delete<ResponseModel<T>>(`${this.baseUrl}/check-out-rug`, {
      params: this.stringifyParams({ uuid: uuid }),
    });
  }

}