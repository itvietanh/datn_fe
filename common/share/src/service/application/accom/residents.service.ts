import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { ResponseModel } from 'share';

@Injectable({
  providedIn: 'root',
})
export class ResidentsService extends BaseService {
  protected override prefix = 'residents';

  reqVneidShareInfo(qrCode: string) {
    return this.http.post<ResponseModel<any>>(
      `${this.baseUrl}/req-vneid-share-info`,
      {
        qrCode,
      }
    );
  }

  getVneidShared(qrCodeId: string) {
    return this.http.get<ResponseModel<string>>(
      `${this.baseUrl}/get-vneid-shared`,
      {
        params: { qrCodeId },
      }
    );
  }
}
