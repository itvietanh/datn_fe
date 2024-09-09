import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ConfirmationComponent } from './confirmation.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  constructor(private modalService: NzModalService) {}

  show(content?: Partial<ConfirmationComponent>) {
    const modalRef = this.modalService.create({
      nzTitle: undefined,
      nzClosable: false,
      nzContent: ConfirmationComponent,
      nzFooter: null,
      nzComponentParams: {
        confirmation: content?.confirmation,
        labelButton: content?.labelButton,
        iconButton: content?.iconButton,
      },
    });
    return modalRef;
  }
}
