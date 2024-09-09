import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';

@Injectable({
  providedIn: 'root',
})
export class StatusTemplateService extends BaseService {
  protected override prefix = 'status-temps';
}
