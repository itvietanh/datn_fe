import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { ResponseModel } from 'share';

@Injectable({
  providedIn: 'root',
})
export class RegisAccomFacilityService extends BaseService {
  protected override prefix = 'regis-accom-facility';
  public updateStatus<T = any>(body: any = {}) {
    return this.http.put<ResponseModel<T>>(
      `${this.baseUrl}/update-status`,
      body
    );
  }

  public addRegister<T = any>(body: any = null) {
    return this.http.post<ResponseModel<T>>(
      `${this.baseUrl}/add-register`,
      body
    );
  }

  public editRegister<T = any>(body: any = null) {
    return this.http.post<ResponseModel<T>>(
      `${this.baseUrl}/edit-register`,
      body
    );
  }
}
