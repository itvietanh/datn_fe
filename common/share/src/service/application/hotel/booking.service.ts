import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';


@Injectable({
  providedIn: 'root'
})
export class BookingService extends BaseService {
  protected override prefix = 'booking-room';

  public override getPaging<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/get-list`, {
      params: this.stringifyParams(params)
    });
  }

  public getListGuest<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/get-list-guest`, {
      params: this.stringifyParams(params)
    });
  }

  public getListRoomType<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/get-room-type`, {
      params: this.stringifyParams(params)
    });
  }

  public override add<T = any>(body: any = null) {
    return this.http.post<ResponseModel<T>>(`${this.baseUrl}`, body);
  }
}
