import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LocalStorageUtil } from '../utils';
import { MessageService } from './message.service';
import { LocationStrategy } from '@angular/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private message: MessageService,
    private local: LocationStrategy,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/dang-nhap']);
      return false;
    } 
    return true;
  }
}
