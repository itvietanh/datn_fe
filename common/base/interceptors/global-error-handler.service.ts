import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { MessageService } from '../service/message.service';
import { DialogService } from 'share';

const HttpErrorResponsePrefix = 'Uncaught (in promise): HttpErrorResponse: ';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private messageService: MessageService,
    private dialogService: DialogService,
    private _ngZone: NgZone
  ) {}
  handleError(error: Error | HttpErrorResponse): void {
    console.log('error', error);

    this.dialogService.closeLoading();
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
    if (chunkFailedMessage.test(error.message)) {
      this._ngZone.run(() => {
        this.messageService.alertOption({
          content:
            'Tài nguyên web đang chưa khớp với phía máy chủ! Vui lòng ấn (ctrl + F5) để tải lại tài nguyên.',
          cancelText: undefined,
          signel: true,
        });
      });
      return;
    }

    if (error instanceof HttpErrorResponse) {
      console.log('log subrice');

      let httpError: any = error;
      // lỗi mạng
      if (httpError.status === 0) {
        this._ngZone.run(() => {
          this.messageService.alertOption({
            content: 'Không thể kết nối. Vui lòng kiểm tra lại kết nối mạng',
            cancelText: 'Đóng',
            signel: true,
          });
        });
        return;
      }

      let message = 'Lỗi hệ thống';
      if (httpError.error?.errors) {
        if (httpError.error?.errors?.message) {
          // nếu lỗi kiểu message
          message = httpError.error?.errors?.message;
        } else {
          // lỗi kiểu key
          for (const key in httpError.error?.errors) {
            message = httpError.error.errors[key];
          }
        }
      }

      this._ngZone.run(() => {
        this.messageService.alertOption({
          content: message,
          signel: true,
        });
      });
    } else {
      console.log('error promise');

      let messageTxt = error.message;
      let httpError;
      try {
        httpError = JSON.parse(
          messageTxt
            .replace('Uncaught (in promise): k:', '')
            .replace('Uncaught (in promise): Xe:', '')
            .replace('Uncaught (in promise): HttpErrorResponse:', '')
            .trim()
        );
      } catch (error) {
        return;
      }
      let message = 'Lỗi hệ thống';
      if (httpError.error?.errors) {
        if (httpError.error?.errors?.message) {
          // nếu lỗi kiểu message
          message = httpError.error?.errors?.message;
        } else {
          // lỗi kiểu key
          for (const key in httpError.error?.errors) {
            message = httpError.error.errors[key];
          }
        }
      }

      this._ngZone.run(() => {
        this.messageService.alertOption({
          content: message,
          signel: true,
        });
      });
    }
  }
}
