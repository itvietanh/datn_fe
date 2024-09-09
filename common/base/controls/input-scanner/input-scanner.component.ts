import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewEncapsulation,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';

@Component({
  selector: 'input-scanner',
  templateUrl: './input-scanner.component.html',
  styleUrls: ['./input-scanner.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputScannerComponent),
      multi: true,
    },
  ],
})
export class InputScannerComponent
  implements ControlValueAccessor, AfterViewInit
{
  @ViewChild(ZXingScannerComponent) child!: ZXingScannerComponent;

  _onChange!: (_: any) => void;
  _onTouched!: (_: any) => void;

  ngAfterViewInit(): void {}

  writeValue(obj: any): void {}

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  onChange(value: any): void {
    if (this._onChange) {
      this._onChange(value);
    }
  }
}
