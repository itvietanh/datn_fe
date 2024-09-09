import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { ResponseModel } from 'share';

@Injectable({
  providedIn: 'root',
})
export class AccommodationsUtilitiesService extends BaseService {
  protected override prefix = 'accommodations-utilities';

  public deleteCustome<T = any>(params: any) {
    return this.http.delete<ResponseModel<T>>(`${this.baseUrl}`, {
      params: this.stringifyParams(params),
    });
  }
}
