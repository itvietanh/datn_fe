import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';
import { LocalStorageUtil } from 'common/base/utils';

@Injectable({
  providedIn: 'root',
})
export class PrivilegeService extends BaseService {
  protected override prefix = 'privileges';
  public listPrivilege: any[] = [];

  public getByUser<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/by-user`, {
      params: this.stringifyParams(params),
    });
  }

  public async initPrivilege() {
    // if (!LocalStorageUtil.getFacilityId()) return;
    const rs = await this.getByUser().firstValueFrom();
    this.listPrivilege = rs.data?.items!.map((x) => x.id)!;
  }
}
