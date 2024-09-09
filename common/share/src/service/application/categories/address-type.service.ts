import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class AddressTypeService extends BaseService {
  protected override prefix = 'categories/address-types';
}
