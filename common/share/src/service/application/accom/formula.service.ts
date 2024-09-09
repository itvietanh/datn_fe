import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { ResponseModel } from 'share';

@Injectable({
  providedIn: 'root'
})
export class FormulaService extends BaseService {
  protected override prefix = 'formulas';

  public test<T = any>(body: any) {
    return this.http.post<ResponseModel<T>>(`${this.baseUrl}/test`, body);
  }
}
