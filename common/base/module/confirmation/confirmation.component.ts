import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[confirmation], app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent {
  @ViewChild('template', { read: TemplateRef }) template!: TemplateRef<void>;
  @Input() confirmation: string | TemplateRef<HTMLDivElement> | undefined;
  @Input() labelButton?: string;
  @Input() labelButtonCancel?: string;
  @Input() iconButton!: string;
  @Output() dismiss = new EventEmitter();
  @Output() confirmed = new EventEmitter();
  data: any;
  modalRef?: NzModalRef;
  confirmationString!: string;
  confirmationTemplate!: TemplateRef<HTMLDivElement>;
  constructor(private modalService: NzModalService) {}

  @HostListener('click')
  show(data?: any) {
    if (!this.confirmation) {
      this.confirmed.emit();
      return;
    }
    if (typeof this.confirmation === 'string') {
      this.confirmationString = this.confirmation;
    } else {
      this.confirmationTemplate = this.confirmation;
    }
    this.data = data;
    this.modalRef = this.modalService.create({
      nzTitle: undefined,
      nzClosable: false,
      nzContent: this.template,
      nzFooter: null,
    });
  }

  hide() {
    this.dismiss.emit();
    this.modalRef?.destroy();
  }

  confirm() {
    this.confirmed.emit(this.data);
    this.modalRef?.destroy();
  }
}
