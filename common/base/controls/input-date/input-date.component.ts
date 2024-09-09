import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
} from '@angular/forms';
import Inputmask from 'inputmask';
import { differenceInCalendarDays } from 'date-fns';

declare let $: any;
@Component({
  selector: 'input-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDateComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputDateComponent),
      multi: true,
    },
  ],
})
export class InputDateComponent
  implements OnInit, AfterViewInit, ControlValueAccessor, Validator, OnChanges
{
  constructor(private el: ElementRef, public datePipe: DatePipe) {}

  @Input() class: any = '';
  @Input() placeholder: any = '';
  @Input() disabled = false;
  @Input() hidden = false;
  @Input() readonly = false;
  @Input() format = 'dd/MM/yyyy';
  @Input() type = 'number';
  public objFormatShow: any = {
    date: '__/__/____',
    month: '__/____',
    year: '____',
  };
  public objFormatSet: any = {
    date: 'dd/mm/yyyy',
    month: 'mm/yyyy',
    year: 'yyyy',
  };
  @Input() allowClear = true;
  @Input() min: Date | undefined;
  @Input() max: Date | undefined;
  // tslint:disable-next-line:no-output-rename
  @Output('onChange') eventOnChange = new EventEmitter<any>();
  // tslint:disable-next-line:no-output-rename
  @Output('onBlur') eventOnBlur = new EventEmitter<void>();
  // tslint:disable-next-line:no-output-rename
  @Output('onUnBlur') eventOnUnBlur = new EventEmitter<void>();

  @ViewChild('myInputDate') myInputElementRef!: ElementRef;

  // tslint:disable-next-line:member-ordering
  public controlValueDate: Date | null = null;
  public controlValue: string | null = null;
  public pickerOpen = false;

  eventBaseChange = (_: any) => {};
  eventBaseTouched = () => {};

  ngOnInit(): void {
    if (this.max) {
      this.max.setHours(0);
      this.max.setMinutes(0);
      this.max.setSeconds(0);
      this.max.setMilliseconds(0);
    }

    if (this.min) {
      this.min.setHours(0);
      this.min.setMinutes(0);
      this.min.setSeconds(0);
      this.min.setMilliseconds(0);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {}

  validate(c: FormControl) {
    if (c.valid && this.controlValueDate) {
      if (this.max) {
        if (
          this.max &&
          differenceInCalendarDays(this.controlValueDate, this.max) > 0
        ) {
          return {
            error: `Ngày không được lớn hơn ${this.datePipe.transform(
              this.max,
              'dd/MM/yyyy'
            )}`,
          };
        }
      }
      if (this.min) {
        if (
          this.min &&
          differenceInCalendarDays(this.controlValueDate, this.min) < 0
        ) {
          return {
            error: `Ngày không được nhỏ hơn ${this.datePipe.transform(
              this.min,
              'dd/MM/yyyy'
            )}`,
          };
        }
      }
    }
    return null;
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    let valid = true;
    if (this.max && valid) {
      valid = differenceInCalendarDays(current, this.max) <= 0;
    }
    if (this.min && valid) {
      valid = differenceInCalendarDays(current, this.min) >= 0;
    }
    return !valid;
  };

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.maskFormat('date');
      $(this.el.nativeElement)
        .find('nz-date-picker')
        .find('input')
        .attr('tabindex', '-1');
    }, 0);
  }

  maskFormat(format: string): void {
    Inputmask('datetime', {
      inputFormat: this.objFormatSet[format],
      placeholder: this.objFormatShow[format],
      alias: 'datetime',
      min: '01/01/0000',
      clearMaskOnLostFocus: false,
    }).mask(this.myInputElementRef.nativeElement);
  }

  writeValue(obj: any): void {
    if (!obj) {
      this.controlValue = null;
      this.controlValueDate = null;
      return;
    }
    if (typeof obj === 'string') {
      this.controlValueDate = new Date(obj);
      this.controlValue = this.datePipe.transform(
        this.controlValueDate,
        this.format
      );
    } else if (typeof obj === 'number') {
      try {
        this.controlValueDate = obj.convertYYYYMMDDToDate();
        this.controlValue = this.datePipe.transform(
          this.controlValueDate,
          this.format
        );
      } catch (error) {
        console.error('Lỗi dữ liệu datetime', obj);
      }
    } else {
      try {
        this.controlValueDate = obj;
        this.controlValue = this.datePipe.transform(
          this.controlValueDate,
          this.format
        );
      } catch (error) {
        console.error('Lỗi dữ liệu datetime', obj);
      }
    }

    // neu date co gio, phut, giay thi update lai (fix)
    // if (obj && (this.controlValueDate!.getHours() > 0 || this.controlValueDate!.getMinutes() > 0 || this.controlValueDate!.getMilliseconds() > 0)) {
    //   this.controlValueDate = new Date(this.controlValueDate!.getFullYear(), this.controlValueDate!.getMonth(), this.controlValueDate!.getDate());
    //   this.controlValue = this.datePipe.transform(this.controlValueDate, this.format);

    //   if (/[_]/.test(this.controlValue!)) {
    //     this.controlValue = null;
    //   }
    //   const value = this.getValueControl();
    //   this.eventBaseChange(value);
    //   this.eventOnChange.emit(value);
    // }
  }

  registerOnChange(fn: any): void {
    this.eventBaseChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.eventBaseTouched = fn;
  }

  onBlur(): void {
    this.eventBaseTouched();
    this.eventOnBlur.emit();
  }

  onUnBlur(): void {
    this.eventOnUnBlur.emit();
  }

  setValue(value: any) {
    this.controlValue = value;
    this.onChange();
  }

  checkCopy(event: KeyboardEvent) {
    if (event.code === 'KeyV' && event.ctrlKey) {
      // set time out fix bug texmark chưa kịp xử lý đã ấn pase nhanh quá
      setTimeout(() => {
        let value = this.myInputElementRef.nativeElement.value;
        this.controlValue = value;
        this.onChange();
      }, 300);
    }
  }

  onChange(): void {
    // this.eventBaseChange(this.getValueControl());
    // this.eventOnChange.emit(this.getValueControl());
    if (/[_]/.test(this.controlValue!)) {
      this.controlValue = null;
    }
    const value = this.getValueControl();
    this.controlValueDate = value;
    this.pickerOpen = false;
    this.eventBaseChange(this.getValueOut(value));
    this.eventOnChange.emit(this.getValueOut(value));
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  getValueControl(): Date | null {
    if (!this.controlValue) {
      return null;
    }
    return this.getValueDate();
  }

  getValueOut(value: Date | null) {
    if (!value) return null;
    return this.type === 'number' ? value.toNumberYYYYMMDD() : value;
  }

  getValueDate(): Date {
    const arrDate = this.controlValue!.split('/');
    return new Date(+arrDate[2], +arrDate[1] - 1, +arrDate[0]);
  }

  handleEndOpenChange(open: boolean): void {
    this.pickerOpen = open;
  }

  openPicker(): void {
    this.pickerOpen = !this.pickerOpen;
  }

  onChangePicker(): void {
    this.controlValue = this.datePipe.transform(
      this.controlValueDate,
      this.format
    );
    this.onChange();
  }

  onClear(): void {
    this.controlValue = null;
    this.controlValueDate = null;
    this.eventBaseChange(this.controlValue);
    this.eventOnChange.emit(this.controlValue);
  }
}
