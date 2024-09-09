import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { ResponseModel } from 'share';

@Injectable({
  providedIn: 'root'
})
export class ServiceDetailService extends BaseService {
  protected override prefix = 'service-details';

  public checkIn<T = any>(body: any = null) {
    return this.http.post<ResponseModel<T>>(`${this.baseUrl}/check-in-by-accom`, body);
  }

  public checkOut<T = any>(body: any = null) {
    return this.http.post<ResponseModel<T>>(`${this.baseUrl}/check-out-by-accom`, body);
  }

  public checkOutAll<T = any>(body: any = null) {
    return this.http.post<ResponseModel<T>>(`${this.baseUrl}/check-out-all-by-accom`, body);
  }
}
