import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogConfirmMode } from 'share';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss']
})
export class DialogConfirmComponent implements OnInit {

  @Input() mode: string = DialogConfirmMode.alert;
  @Input() content!: string;
  @Input() okText: string | undefined;
  @Input() cancelText: string | undefined;
  @Output() onClose = new EventEmitter<boolean>();

  public dialogConfirmMode = DialogConfirmMode;

  constructor() { }

  ngOnInit() {
  }

  ok() {
    this.onClose.emit(true);
  }

  cancel() {
    this.onClose.emit(false);
  }

}
