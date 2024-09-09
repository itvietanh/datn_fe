import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessTypeService extends BaseService {
  protected override prefix = 'categories/business-types';
}
