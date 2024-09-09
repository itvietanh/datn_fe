import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class UtilityService extends BaseService {
  protected override prefix = 'utilities';
}
