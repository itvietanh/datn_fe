import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class ContractAccomService extends BaseService {
  protected override prefix = 'contracts-accommodations';

}
