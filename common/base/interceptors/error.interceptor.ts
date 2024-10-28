import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DialogService } from 'share';
import { MessageService } from '../service/message.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private messageService: MessageService,
    private dialogService: DialogService,
    private location: Location
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.dialogService.closeLoading();

        // lỗi login
        
        if (error.status === 401) {
          location.href = this.location.prepareExternalUrl('/dang-nhap');
          return throwError(() => null);
        }

        // lỗi ko co quyền
        if (error.status === 403) {
          this.messageService
            .alertOption({
              content: 'Bạn không có quyền sử dụng trang này',
              signel: true,
            })
            ?.then((x) => {
              localStorage.removeItem('x-facility-id');
              location.href = this.location.prepareExternalUrl(
                '/error/403?message=status403'
              );
            });
          return throwError(() => null);
        }

        // lỗi message báo cho người dùng
        return throwError(() => error);
      })
    );
  }
}
