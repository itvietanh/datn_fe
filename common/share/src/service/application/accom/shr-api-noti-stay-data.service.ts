import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShrApiNotiStayData extends BaseService {
  protected override prefix = 'shr-api-noti-stay-data';
  public listAccom: any[] = [];

  public getByUser<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}`, {
      params: this.stringifyParams(params),
    });
  }

  public deleteDataError<T=any>(importId: any) {
    return this.http.delete<ResponseModel<T>>(
      `${this.baseUrl}/delete-data-error`,
      {
        params: { id: importId }
      }
    );
  }

  public exportTemplate(fileName: string) {
    return this.http
      .get(`${this.baseUrl}/export`, {
        responseType: 'blob',
      })
      .pipe(
        tap((data) => {
          const blob = new Blob([data], { type: 'application/octet-stream' });
          const downloadURL = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadURL;
          link.download = fileName;
          link.click();
        })
      );
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
