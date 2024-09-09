import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { ResponseModel } from 'share';

@Injectable({
  providedIn: 'root',
})
export class AccommodationUserService extends BaseService {
  protected override prefix = 'accommodation-users';

  public findByUser<T = any>() {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/by-user`, {});
  }

  public getByUuid<T = any>(uuid: any) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/by-uuid`, {
      params: this.stringifyParams({uuid: uuid}),
    });
  }
}
