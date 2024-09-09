import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';

@Injectable({
  providedIn: 'root',
})
export class DonViService extends BaseService {
  protected override prefix = 'categories/donvi';

  public getComboboxDiaChinh(params: any = {}) {
    return this.getCombobox({ ...params });
  }
}
