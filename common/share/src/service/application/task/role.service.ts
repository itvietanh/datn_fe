import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleService extends BaseService {
  protected override prefix = 'roles';

  getOptions(params: any = {}) {
    return this.getPaging(params).pipe(
      map((res) => ({
        ...res,
        data: {
          ...res.data,
          items: res.data?.items
            .filter((x) => x.name.toLowerCase() !== 'admin')
            .map((item) => ({
              value: item.id,
              label: item.name,
            })),
        },
      }))
    );
  }
}
