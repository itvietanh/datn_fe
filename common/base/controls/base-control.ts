import { Directive, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Directive()
export class BaseControlValueAccessor implements ControlValueAccessor {
  @Input() disabled = false;
  @Input() placeholder: string | string[] = '';

  value: any;

  _onChange!: (_: any) => void;
  _onTouched!: (_: any) => void;

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange(value: any): void {
    if (this._onChange) {
      this._onChange(value);
    }
  }
}
