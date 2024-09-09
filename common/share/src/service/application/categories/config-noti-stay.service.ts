import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { ResponseModel } from 'share';

@Injectable({
  providedIn: 'root',
})
export class ConfigNotiStayService extends BaseService {
  protected override prefix = 'config-noti-stay';

}
