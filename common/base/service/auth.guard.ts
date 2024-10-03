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
    return true;
  }
}
