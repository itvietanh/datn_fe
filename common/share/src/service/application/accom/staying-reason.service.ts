import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';

@Injectable({
  providedIn: 'root',
})
export class StayingReasonService extends BaseService {
  protected override prefix = 'staying-reasons';
}
