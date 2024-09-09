import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { PagedListModel, ResponseModel } from 'share';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageHubService extends BaseService {
  protected override prefix = 'messages';

  public getComboboxGroup(params: any = null) {
    return this.http
      .get<ResponseModel<PagedListModel>>(`${this.baseUrl}/group`, {
        params: this.stringifyParams(params),
      })
      .pipe(
        map((x) => ({
          ...x,
          data: {
            ...x.data,
            items: x.data!.items.map((y) => ({ value: y.id, label: y.name })),
          },
        }))
      );
  }

  public getPagingGroup<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/group`, {
      params: this.stringifyParams(params),
    });
  }

  public addGroup<T = any>(body: any = null) {
    return this.http.post<ResponseModel<T>>(`${this.baseUrl}/group`, body);
  }

  public deleteGroup<T = any>(id: string) {
    return this.http.delete<ResponseModel<T>>(`${this.baseUrl}/group`, {
      params: this.stringifyParams({ id: id }),
    });
  }
}
