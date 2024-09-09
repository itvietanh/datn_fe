import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends BaseService {
  protected override prefix = 'projects';
}
