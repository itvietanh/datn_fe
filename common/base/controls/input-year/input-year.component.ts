// tslint:disable-next-line: max-line-length
import { DatePipe } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnChanges, Input, Output, EventEmitter, ElementRef, SimpleChanges, ViewEncapsulation, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';
import { differenceInCalendarDays } from 'date-fns';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
declare let $: any, Inputmask: any;
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'input-year',
  templateUrl: './input-year.component.html',
  styleUrls: ['./input-year.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputYearComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputYearComponent),
      multi: true
    }
  ]
})
export class InputYearComponent implements OnInit, AfterViewInit, ControlValueAccessor, Validator, OnChanges {
  constructor(
    private el: ElementRef,
    public datePipe: DatePipe
  ) {
  }

  @Input() class: any = '';
  @Input() placeholder: any = '';
  @Input() disabled = false;
  @Input() hidden = false;
  @Input() readonly = false;
  @Input() allowClear = true;
  @Input() min: number | undefined;
  @Input() max: number | undefined;
  private listFormat: any[] = [];
  // tslint:disable-next-line:no-output-rename
  @Output('onChange') eventOnChange = new EventEmitter<any>();
  // tslint:disable-next-line:no-output-rename
  @Output('onBlur') eventOnBlur = new EventEmitter<void>();
  // tslint:disable-next-line:no-output-rename
  @Output('onUnBlur') eventOnUnBlur = new EventEmitter<void>();

  @ViewChild('myInputDate') myInputElementRef!: ElementRef;
  @ViewChild('dateTimePicker') dateTimePicker!: NzDatePickerComponent;
  @Output('onKeyEnter') eventOnKeyEnter = new EventEmitter<any>();

  // tslint:disable-next-line:member-ordering
  public controlValueDate: Date | null = null;
  // public controlValueNumber: number | null = null;
  public controlValue: string | null = null;
  public pickerOpen = false;

  public format = 'yyyy';
  public objFormatShow: any = {
    date: '__/__/____',
    month: '__/____',
    year: '____'
  };
  public objFormatSet: any = {
    date: 'dd/mm/yyyy',
    month: 'mm/yyyy',
    year: 'yyyy'
  };
  public listOption: any[] = [];
  public typePicker = 'year';

  eventBaseChange = (_: any) => {
  }
  eventBaseTouched = () => {
  }

  ngOnInit(): void {
    if (!this.listFormat) this.listFormat = [];
    if (this.listFormat.length === 0) {
      this.listFormat = [
        'yyyy'
      ];
    }
    this.listOption = [];
    for (const item of this.listFormat) {
      switch (item) {
        case 'dd/mm/yyyy':
          this.listOption.push({ value: 'date', text: 'Ngày' });
          break;
        case 'mm/yyyy':
          this.listOption.push({ value: 'month', text: 'Tháng' });
          break;
        case 'yyyy':
          this.listOption.push({ value: 'year', text: 'Năm' });
          break;
      }
    }
    if (this.listFormat.findIndex(x => x === 'dd/mm/yyyy') !== -1) {
      this.format = 'dd/mm/yyyy';
      this.typePicker = 'date'
    } else if (this.listFormat.findIndex(x => x === 'mm/yyyy') !== -1) {
      this.format = 'mm/yyyy';
      this.typePicker = 'month'
    } else {
      this.format = 'yyyy';
      this.typePicker = 'year'
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('change');
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.maskFormat(this.typePicker);
      $(this.el.nativeElement).find('nz-date-picker').find('input').attr('tabindex', '-1');
    }, 50);
  }

  validate(c: FormControl) {
    if (c.valid && this.controlValue) {
      const vl = this.getValueNumber()!.toString().length;
      if (this.max) {
        if (this.max && this.max < this.getValueNumber()!) {
          return { error: `Năm không được lớn hơn năm ${this.max}` }
        }
      }
      if (this.min) {
        if (this.min && +this.min > this.getValueNumber()!) {
          return { error: `Năm không được nhỏ hơn năm ${this.min}` }
        }
      }
    }
    return null;
  }

  disabledDate = (current: Date): boolean => {

    // Can not select days before today and today
    let valid = true;
    if (this.max && valid) {
      valid = current.getFullYear() <= this.max;
    }
    if (this.min && valid) {
      valid = valid = current.getFullYear() >= this.min;
    }
    return !valid;
  }

  writeValue(obj: number | null): void {
    // console.log('writeValue',obj);
    if (!obj) {
      this.controlValue = null;
      this.controlValueDate = null;
      return;
    }
    if (obj) {
      this.controlValue = this.convertYYYYMMDDtoStringFormat((obj + '').length, (obj + ''));
      this.controlValueDate = this.convertYYYYMMDDtoDateFormat((obj + '').length, (obj + ''));
      this.format = this.getFormat(this.controlValue.replace(/\//g, '').length);
      this.maskFormat(this.format);
    }
  }

  convertYYYYMMDDtoStringFormat(len: number, obj: string): string {
    switch (len) {
      case 4:
        return obj;
      case 6:
        return obj.substring(4, 6) + '/' + obj.substring(0, 4);
      default:
        return obj.substring(6, 8) + '/' + obj.substring(4, 6) + '/' + obj.substring(0, 4);
    }
  }

  convertYYYYMMDDtoDateFormat(len: number, obj: string): Date {
    switch (len) {
      case 4:
        return new Date(+obj, 0, 1);
      case 6:
        return new Date(+obj.substring(0, 4), +obj.substring(4, 6), 1);
      default:
        return new Date(+obj.substring(0, 4), +obj.substring(4, 6), +obj.substring(6, 8));
    }
  }

  getFormat(len: number): string {
    if (len === 4) {
      this.typePicker = 'year';
      return 'year';
    }
    if (len === 6) {
      this.typePicker = 'month';
      return 'month';
    }
    if (len === 8) {
      this.typePicker = 'date';
      return 'date';
    }

    return 'date';
  }


  changeMaskByLength(len: number): string {
    if (len === 4) {
      this.typePicker = 'year';
      this.maskFormat('year');
      return 'yyyy';
    }
    if (len === 6) {
      this.typePicker = 'month';
      this.maskFormat('month');
      return 'mm/yyyy';
    }
    if (len === 8) {
      this.typePicker = 'date';
      this.maskFormat('date');
      return 'dd/mm/yyyy';
    }

    return 'dd/mm/yyyy';
  }

  maskFormat(format: string): void {
    if (this.myInputElementRef?.nativeElement) {
      Inputmask('datetime', {
        inputFormat: this.objFormatSet[format],
        placeholder: this.objFormatShow[format],
        alias: 'datetime',
        min: '01/01/0000',
        clearMaskOnLostFocus: false,
      }).mask(this.myInputElementRef.nativeElement);
    }
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
    this.pickerOpen = true;
  }

  onUnBlur(): void {
    this.eventOnUnBlur.emit();
    this.pickerOpen = false;
  }

  onChange(): void {
    if (/[_]/.test(this.controlValue!)) {
      this.controlValue = null;
    }
    const value = this.getValueControl();
    this.controlValueDate = this.getValueDate();
    this.pickerOpen = false;
    this.eventBaseChange(value);
    this.eventOnChange.emit(value);
    this.eventOnKeyEnter.emit(value)

    // if (this.controlValue.length > 5) {
    //   Inputmask('datetime', {
    //     inputFormat: 'dd/mm/yyyy',
    //     placeholder: '__/__/____',
    //     alias: 'datetime',
    //     min: '01/01/0000',
    //     clearMaskOnLostFocus: false,
    //     // isComplete: (buffer, opts) => {
    //     //   console.log('Data', buffer, opts);
    //     // },
    //   }).mask(this.myInputElementRef.nativeElement);
    // }
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  getValueControl(): number | null {
    if (!this.controlValue) {
      return null;
    }
    return this.getValueNumber();
  }

  getValueDate(): Date | null {
    if (!this.controlValue) {
      return null;
    }
    let value = this.getValueNumber().toString();
    if (value.length === 4) {
      return new Date(+value, 0, 1)
    }
    if (value.length === 6) {
      return new Date(+(value.substring(0, 4)), +(value.substring(4, 6)) - 1, 1)
    }
    if (value.length === 8) {
      return new Date(+(value.substring(0, 4)), +(value.substring(4, 6)) - 1, +(value.substring(6, 8)));
    }
    return null;
  }

  getValueNumber(): number {
    const arrDate = this.controlValue!.split('/').reverse();
    return +arrDate.join('');
  }

  handleEndOpenChange(open: boolean): void {
    this.pickerOpen = open;
  }

  openPicker(): void {
    this.pickerOpen = !this.pickerOpen;
  }

  onChangePicker(): void {
    // console.log(this.controlValueDate);
    // this.controlValue = this.controlValue = this.datePipe.transform(this.controlValueDate, this.format);
    // console.log('change', this.controlValueDate);

    switch (this.typePicker) {
      case 'date':
        this.controlValue = this.datePipe.transform(this.controlValueDate, 'dd/MM/yyyy');
        break;
      case 'month':
        this.controlValue = this.datePipe.transform(this.controlValueDate, 'MM/yyyy');
        break;
      default:
        this.controlValue = this.datePipe.transform(this.controlValueDate, 'yyyy');
        break;
    }
    this.onChange();
  }

  onChangeFormat($event: any): void {
    this.maskFormat($event);
    this.typePicker = $event;
    switch ($event) {
      case 'date':
        this.format = 'dd/mm/yyyy';
        this.controlValue = this.datePipe.transform(this.controlValueDate, 'dd/MM/yyyy');
        break;
      case 'month':
        this.format = 'mm/yyyy';
        this.controlValue = this.datePipe.transform(this.controlValueDate, 'MM/yyyy');
        break;
      default:
        this.format = 'yyyy';
        this.controlValue = this.datePipe.transform(this.controlValueDate, 'yyyy');
        break;
    }
    this.onClear();
  }

  onClear(): void {
    this.controlValue = null;
    this.controlValueDate = null;
    this.eventBaseChange(this.controlValue);
    this.eventOnChange.emit(this.controlValue);
    this.eventOnKeyEnter.emit(this.controlValue)
  }
}
