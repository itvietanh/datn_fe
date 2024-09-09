import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';
import { LocalStorageUtil } from 'common/base/utils';

@Injectable({
  providedIn: 'root',
})
export class MenuService extends BaseService {
  protected override prefix = 'menu';
  public listMenu: any[] = [];

  public getAll<T = PagedListModel>() {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/all`, {
      params: this.stringifyParams({ orderBy: 'index-asc' }),
    });
  }

  public async initMenu() {
    if (!LocalStorageUtil.getFacilityId()) return;
    const rs = await this.getAll().firstValueFrom();
    this.listMenu = rs.data?.items!.filter(x => x.isShow) ?? [];
  }

  public verifyMenu(listPrivilege: any[]) {
    for (const item of this.listMenu) {
      if (!item.privileges) item.privileges = [];
    }
    let dataRaw = this.listMenu.filter(m => m.privileges.some((p: any) => listPrivilege.includes(p)));
    // bo sung cac menu cha
    this.addParentMiss(dataRaw);
    dataRaw.sort((a, b) => ((a.index ?? 0) - (b.index ?? 0)));
    this.listMenu = dataRaw;
  }

  private addParentMiss(data: any[]) {
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      if (item.parentUid) {
        const checkParent = data.findIndex(x => x.id === item.parentUid);
        if (checkParent === -1) {
          data.push(this.listMenu.find(x => x.id === item.parentUid));
        }
      }
    }
  }
}
