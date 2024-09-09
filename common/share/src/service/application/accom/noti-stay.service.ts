import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class NotiStayService extends BaseService {
  protected override prefix = 'noti-stay';
}
