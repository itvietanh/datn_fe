import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCESS_TOKEN_KEY, HOTEL_ID_KEY, LocalStorageUtil } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let authReq = req;
    const token = LocalStorageUtil.getItem(ACCESS_TOKEN_KEY);

    if (token) {
      let headers = authReq.headers.set('Authorization', `Bearer ${token}`);
      authReq = authReq.clone({ headers: headers });
    }

    if (LocalStorageUtil.getHotelId()) {
      let headers = authReq.headers.set(
        HOTEL_ID_KEY,
        LocalStorageUtil.getHotelId().toString()
      );
      authReq = authReq.clone({ headers: headers });
    }

    return next.handle(authReq);
  }
}
