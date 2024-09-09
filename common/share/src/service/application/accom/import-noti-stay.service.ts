import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';

@Injectable({
  providedIn: 'root',
})
export class ImportNotiStayService extends BaseService {
  protected override prefix = 'shr-import-noti-stay';

  public upload(body: any = null) {
    let blob = new Blob([JSON.stringify(body)], { type: 'octet/stream' });
    let formData: FormData = new FormData();
    formData.append('file', blob);

    return this.http.post(`${this.baseUrl}`, formData);
  }
}
