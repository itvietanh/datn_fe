import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';

@Injectable({
  providedIn: 'root',
})
export class DiaBanService extends BaseService {
  protected override prefix = 'categories/diachinh';

  public getComboboxCity(params: any = {}) {
    return this.getCombobox({ ...params, capDiaChinh: 'T' });
  }

  public getComboboxDistrict(params: any = {}) {
    return this.getCombobox({ ...params, capDiaChinh: 'Q' });
  }

  public getComboboxVillage(params: any = {}) {
    return this.getCombobox({ ...params, capDiaChinh: 'P' });
  }

  public getComboboxCityByCode(params: any = {}) {
    return this.getComboboxByCode({ ...params, capDiaChinh: 'T' });
  }

  public getComboboxDistrictByCode(params: any = {}) {
    return this.getComboboxByCode({ ...params, capDiaChinh: 'Q' });
  }

  public getComboboxVillageByCode(params: any = {}) {
    return this.getComboboxByCode({ ...params, capDiaChinh: 'P' });
  }

  private getComboboxByCode<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/options-by-code`, {
      params: this.stringifyParams(params),
    });
  }

  public getComboboxQT<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/quoc-tich`, {
      params: this.stringifyParams(params),
    });
  }
}
