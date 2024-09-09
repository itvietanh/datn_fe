import { Injectable } from '@angular/core';
import { PrinterComponent } from 'common/base/module/printer/printer.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ModalOptions, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private service: NzModalService) {}

  create<T, D = NzSafeAny, R = NzSafeAny>(
    config: ModalOptions<T, D, R>,
    afterClose?: (value: R) => void
  ): NzModalRef<T, R> {
    const modal = this.service.create({
      nzKeyboard: false,
      nzFooter: null,
      nzClosable: false,
      ...config,
    });
    if (afterClose) {
      modal.afterClose.pipe(filter((v) => Boolean(v))).subscribe(afterClose);
    }
    return modal;
  }

  createPrinter(template: string, view: any) {
    return this.create({
      nzContent: PrinterComponent,
      nzData: { template, view },
    });
  }
}
