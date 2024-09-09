import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';

@Injectable({
  providedIn: 'root',
})
export class ContractServiceService extends BaseService {
  protected override prefix = 'contracts-services';
}
