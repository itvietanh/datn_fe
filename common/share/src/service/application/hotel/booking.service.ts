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

  public order<T = any>(body: any = null) {
    return this.http.post<ResponseModel<T>>(`${this.baseUrl}/order`, body);
  }


  public override getCombobox<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/options`, {
      params: this.stringifyParams(params),
    });
  }

  public updateRoomInRoomType<T = any>(params: any = null) {
    return this.http.put<ResponseModel<T>>(`${this.baseUrl}/update-room-in-rt`, params);
  }

  public override delete<T = any>(id: any) {
    return this.http.delete<ResponseModel<T>>(`${this.baseUrl}/delete-booking`, {
      params: this.stringifyParams({ id }),
    });
  }

  public confirmBooking<T = any>(id: string) {
    return this.http.put<ResponseModel<T>>(`${this.baseUrl}/confirm-booking`, {
      id: id,
    });
  }
}
