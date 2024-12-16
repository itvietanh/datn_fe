import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';

@Injectable({
  providedIn: 'root',
})
export class ServiceCategoryService extends BaseService {
  protected override prefix = 'service-categories';

  
}
