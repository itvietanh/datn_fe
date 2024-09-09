import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';

@Injectable({
  providedIn: 'root',
})
export class QrCodeService extends BaseService {
  protected override prefix = 'qr-codes';
}
