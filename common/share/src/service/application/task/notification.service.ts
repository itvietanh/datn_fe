import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService {
  protected override prefix = 'notifications';
}
