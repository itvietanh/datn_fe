import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceLabelService extends BaseService {
  protected override prefix = 'services-labels';
}
