import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modal-data',
  templateUrl: './modal-data.component.html',
  styleUrls: ['./modal-data.component.scss'],
})
export class ModalDataComponent {
  @Input() formGroup!: FormGroup;
  @Input() isView!: boolean;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();
}
