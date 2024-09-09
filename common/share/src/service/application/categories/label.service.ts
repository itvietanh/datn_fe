import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { ResponseModel } from 'share';

@Injectable({
  providedIn: 'root',
})
export class LabelService extends BaseService {
  protected override prefix = 'labels';

  public override edit<T = any>(body: any = null) {
    return this.http.put<ResponseModel<T>>(`${this.baseUrl}`, {
      ...body,
    });
  }
}
