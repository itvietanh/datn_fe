import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';

@Injectable({
  providedIn: 'root',
})
export class RegisAccomRepresentativeService extends BaseService {
  protected override prefix = 'regis-accom-representative';
}
