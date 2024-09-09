import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  protected override prefix = 'users';
}
