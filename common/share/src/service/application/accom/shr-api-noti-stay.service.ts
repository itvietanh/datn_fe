import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';

@Injectable({
  providedIn: 'root',
})
export class ShrApiNotiStay extends BaseService {
  protected override prefix = 'shr-api-noti-stay';
  public listAccom: any[] = [];

  public getByUser<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}`, {
      params: this.stringifyParams(params),
    });
  }

  public async initData() {
    const rs = await this.getByUser().firstValueFrom();
    this.listAccom = rs.data?.items!;
  }

  public getComboboxFacility() {
    return this.listAccom.map((x) => ({
      value: x.id,
      label: x.accomName,
    }));
  }


  public findOneByUuid<T = any>(uuid: any) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/get`, {
      params: this.stringifyParams({ uuid: uuid }),
    });
  }
}
