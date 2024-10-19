import { Component, Input, forwardRef } from '@angular/core';
import {
  AbstractControl,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';
import { DisabledTimeFn } from 'ng-zorro-antd/date-picker';
import { BaseControlValueAccessor } from '../base-control';

@Component({
  selector: 'input-date-range-picker',
  templateUrl: './input-date-range-picker.component.html',
  styleUrls: ['./input-date-range-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDateRangePickerComponent),
      multi: true,
    },
  ],
})
export class InputDateRangePickerComponent extends BaseControlValueAccessor {
  @Input() showTime = false;
  @Input() type: 'date' | 'dateTime' | 'fullDateTime' = 'dateTime';
  @Input() disabledDate?: (d: Date) => boolean;
  @Input() disabledTime?: DisabledTimeFn;
  format = {
    date: 'dd/MM/yyyy',
    dateTime: 'dd/MM/yyyy HH:mm',
    fullDateTime: 'dd/MM/yyyy HH:mm:ss',
  };

  override writeValue(obj: any[]): void {
    const value = obj?.map((date) => {
      if (!date) {
        return null;
      }
      if (this.type === 'dateTime' || this.type === 'fullDateTime') {
        return date.convertYYYYMMDDHHmmssToDate();
      }
      if (this.type === 'date') {
        return date.convertYYYYMMDDToDate();
      }
      return null;
    });
    super.writeValue(value);
  }

  override onChange(event: Date[]): void {
    const value = event.map((date) => {
      if (!date) {
        return null;
      }
      if (this.type === 'dateTime' || this.type === 'fullDateTime') {
        return date.toNumberYYYYMMDDHHmmss();
      }
      if (this.type === 'date') {
        return date.toNumberYYYYMMDD();
      }
      return null;
    });
    super.onChange(value);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return control.value ? null : { date: true };
  }

  onOk(result: Date | Date[] | null): void {
    this.onChange(result as any);
  }

  onCalendarChange(result: Array<Date | null>): void {
  }
}
