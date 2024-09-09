import {
  AfterViewInit,
  Component,
  ContentChild,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControlDirective,
  FormControlName,
  NgControl,
} from '@angular/forms';
import { NzFormControlComponent } from 'ng-zorro-antd/form';

@Component({
  selector: 'app-form-control',
  templateUrl: './form-control.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class FormControlComponent implements AfterViewInit {
  @ContentChild(NgControl, { static: false }) content?:
    | FormControlName
    | FormControlDirective;

  @ViewChild(NzFormControlComponent) child!: NzFormControlComponent;
  @Input() label?: string;

  get required() {
    let validators = (this.content?.control as any)['_rawValidators'] || [];
    if (!Array.isArray(validators)) {
      validators = [validators];
    }
    return validators.some((v: any) =>
      v.toString().includes('controlValidatorRequired')
    );
  }

  ngAfterViewInit(): void {
    this.child.defaultValidateControl = this.content;
    this.child.ngAfterContentInit();
  }
}
