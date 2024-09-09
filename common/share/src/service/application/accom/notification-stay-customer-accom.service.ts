import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationStayCustomerAccomService extends BaseService {
  protected override prefix = 'notification-stay-customer-accom';
}
