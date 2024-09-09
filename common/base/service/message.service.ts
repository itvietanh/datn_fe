import { debounceTime } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject } from 'rxjs';
import { DialogConfirmComponent } from '../module/dialog-confirm/dialog-confirm.component';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';

import { DialogConfirmDataComponent } from '../module/dialog-confirm-data/dialog-confirm-data.component';
import { DialogService, DialogSize, DialogConfirmMode } from 'share';
import { NzMessageDataOptions, NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public isCloseLoading = new BehaviorSubject<any>(false);
  public infoImport = new BehaviorSubject<any>(null);
  public percentDone = new BehaviorSubject<number>(0);
  public countAlert = 0;

  option: NzMessageDataOptions;
  constructor(
    private modalService: NzModalService,
    private dialogService: DialogService,
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {
    this.option = {
      nzPauseOnHover: true,
      nzDuration: 5000
    };
  }

  public confirm(content: string, mode: string = PopupConfirmMode.alert, okText: string = 'Xác nhận', cancelText: string = 'Hủy'): Promise<boolean> {
    return new Promise<boolean>((resolve, _) => {
      let dialog = this.dialogService.openDialog((option) => {
        option.title = '';
        option.size = DialogSize.small;
        option.class = '';
        option.component = DialogConfirmComponent;
        option.escClose = false;
        option.inputs = {
          mode: mode,
          okText: okText,
          content: content,
          cancelText: cancelText
        };
      },
        (eventName, eventValue) => {
          if (eventName === 'onClose') {
            resolve(eventValue);
            this.dialogService.closeDialogById(dialog.id);
          }
        }
      );
    });
  }

  public confirmData(title: string, okText: string = 'Xác nhận', cancelText: string = 'Hủy', labelText: string = 'Nội dung', requiredValid: boolean = false, maxLength: number | null = null): Promise<any> {
    return new Promise<any>((resolve, _) => {
      let dialog = this.dialogService.openDialog((option) => {
        option.title = title;
        option.size = DialogSize.small;
        option.class = '';
        option.component = DialogConfirmDataComponent;
        option.escClose = false;
        option.inputs = {
          okText: okText,
          cancelText: cancelText,
          labelText: labelText,
          requiredValid: requiredValid,
          maxLength: maxLength
        };
      },
        (eventName, eventValue) => {
          if (eventName === 'onClose') {
            resolve(eventValue);
            this.dialogService.closeDialogById(dialog.id);
          }
        }
      );
    });
  }

  public alert(content: string, cancelText: string | null = 'Đóng') {
    return new Promise<boolean>((resolve, _) => {
      let dialog = this.dialogService.openDialog((option) => {
        option.title = '';
        option.size = DialogSize.small;
        option.class = '';
        option.component = DialogConfirmComponent;
        option.escClose = false;
        option.inputs = {
          mode: 'alert',
          okText: '',
          content: content,
          cancelText: cancelText
        };
      },
        (eventName, eventValue) => {
          if (eventName === 'onClose') {
            resolve(eventValue);
            this.dialogService.closeDialogById(dialog.id);
          }
        }
      );
    });
  }

  public error(content: string, cancelText: string | null = 'Đóng') {
    return new Promise<boolean>((resolve, _) => {
      let dialog = this.dialogService.openDialog((option) => {
        option.title = '';
        option.size = DialogSize.small;
        option.class = '';
        option.component = DialogConfirmComponent;
        option.escClose = false;
        option.inputs = {
          mode: 'alert',
          okText: '',
          content: content,
          cancelText: cancelText
        };
      },
        (eventName, eventValue) => {
          if (eventName === 'onClose') {
            resolve(eventValue);
            this.dialogService.closeDialogById(dialog.id);
          }
        }
      );
    });
  }

  public errorByApi(content: any) {
    return new Promise<boolean>((resolve, reject) => {
      if (typeof content === 'string') {
        if (!content) {
          return;
        }
        this.modalService.error({
          nzTitle: '',
          nzContent: content,
          nzOnOk: () => resolve(true)
        });
      } else if (content instanceof Array) {
        const lstMessageAlert: string[] = [];
        for (const item of content) {
          lstMessageAlert.push(item.name);
        }

        this.modalService.error({
          nzTitle: '',
          nzContent: lstMessageAlert.join('/n'),
          nzOnOk: () => resolve(true)
        });
      } else if (content instanceof Object) {
        const lstMessageAlert: string[] = [];
        for (const k in content) {
          lstMessageAlert.push(content[k]);
        }
        this.confirm(lstMessageAlert.join('/n'), 'alert', 'Đóng', '').then(x => {
          resolve(true)
        });
      }
    });
  }

  public confirmDeleteMulti() {
    return new Promise<boolean>((resolve, _) => {
      this.modalService.confirm({
        nzTitle: 'Bạn có chắc chắn muốn xóa những dữ liệu mà bạn đã chọn không không',
        nzContent: 'Khi bạn nhấn OK, những dữ liệu này sẽ bị xóa khỏi hệ thống',
        nzOnOk: () => resolve(true),
        nzOnCancel: () => resolve(false)
      });
    });
  }

  public notiMessageSuccess(content: string): void {
    this.notification.success('', content);
  }

  public notiMessageError(content: any): void {
    if (typeof content === 'string') {
      if (!content) {
        return;
      }
      this.message.error(content, this.option);
    } else if (content instanceof Array) {
      const lstMessageAlert: string[] = [];
      for (const item of content) {
        lstMessageAlert.push(item.name);
      }
      this.notification.error('', lstMessageAlert.join('\n'), this.option);
    } else if (content instanceof Object) {
      const lstMessageAlert: string[] = [];
      lstMessageAlert.push(content.name);
      this.notification.error('', lstMessageAlert.join('\n'), this.option);
    }
  }

  public notiMessageWarning(content: string): void {
    this.notification.warning('', content, this.option);
  }

  public showNotification(conent: string): void {
    this.notification.success('Thông báo', conent, this.option);
  }

  public alertOption(o: { content: string, cancelText?: string, signel?: boolean }) {
    if (!o.cancelText) o.cancelText = 'Đóng';
    if (o.signel && this.countAlert > 0) return;

    return new Promise<boolean>((resolve, _) => {
      let dialog = this.dialogService.openDialog((option) => {
        option.title = '';
        option.size = DialogSize.small;
        option.class = '';
        option.component = DialogConfirmComponent;
        option.escClose = false;
        option.inputs = {
          mode: 'alert',
          okText: '',
          content: o.content,
          cancelText: o.cancelText
        };
        this.countAlert++;
      },
        (eventName, eventValue) => {
          if (eventName === 'onClose') {
            resolve(eventValue);
            this.dialogService.closeDialogById(dialog.id);
            this.countAlert--;
          }
        }
      );
    });
  }
}

export enum PopupConfirmMode {
  alert = 'alert',
  delete = 'delete'
}
