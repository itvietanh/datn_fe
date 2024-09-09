import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';

@Injectable({
  providedIn: 'root'
})

export class EndPointService extends BaseService {
  protected override prefix = '/api-endpoints';
}
