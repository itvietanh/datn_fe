import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';

@Injectable({
  providedIn: 'root'
})
export class RoomtypeStatistics extends BaseService {
  // Prefix cho các API endpoint
  protected override prefix = 'statistic/roomtype';

  public getDataStatistical<T = any>(params: any = null) {
    // Gọi API thống kê loại phòng, không cần tham số ngày
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}`, {
      params: this.stringifyParams(params)
    });
  }


  public getTotalRoomsByHotel(params: any = null) {
    // API để lấy tổng số phòng hiện có (có thể tùy chọn thêm ngày)
    return this.http.get<ResponseModel<any>>(`${this.baseUrl}/total-roomtype`, {
      params: this.stringifyParams(params)
    });
  }

  public exportExcelTrans(params: any = null) {
    // API để xuất Excel
    return this.http.get(`${this.baseUrl}/export-roomtype`, {
      params: this.stringifyParams(params),
      responseType: 'blob'  // Để nhận file Excel dưới dạng blob
    });
  }
}
