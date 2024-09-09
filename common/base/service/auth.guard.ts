import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { LocalStorageUtil } from '../utils';
import { MessageService } from './message.service';
import { LocationStrategy } from '@angular/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private message: MessageService,
    private local: LocationStrategy
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const baseUrl = this.local.getBaseHref();
    // if (
    //   [baseUrl, '/he-thong/quan-ly-co-so-luu-tru'].includes(
    //     location.pathname
    //   ) ||
    //   [baseUrl, '/he-thong/quan-ly-hop-dong'].includes(location.pathname)
    // ) {
    //   return true;
    // }
    // if (!LocalStorageUtil.getFacilityId()) {
    //   this.message
    //     .alertOption({
    //       content:
    //         'Không xác định được cơ sở lưu trú sử dụng. Vui lòng chọn lại cơ sở lưu trú',
    //       cancelText: undefined,
    //       signel: true,
    //     })
    //     ?.then((x) => (location.href = baseUrl));
    //   return false;
    // }
    return true;
  }
}
