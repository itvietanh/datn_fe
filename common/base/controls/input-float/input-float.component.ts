import { Component, OnInit, ViewEncapsulation, forwardRef, AfterViewInit, OnChanges, Input, Output, EventEmitter, ElementRef, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, NG_VALIDATORS, Validator } from '@angular/forms';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

declare let $: any;
@Component({
  selector: 'input-float',
  templateUrl: './input-float.component.html',
  styleUrls: ['./input-float.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFloatComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputFloatComponent),
      multi: true
    }
  ]
})
export class InputFloatComponent implements OnInit, AfterViewInit, ControlValueAccessor, Validator, OnChanges {
  constructor(
    private el: ElementRef
  ) { }

  @Input() class: any = '';
  @Input() placeholder: any = '';
  @Input() disabled = false;
  @Input() hidden = false;
  @Input() readonly = false;
  @Input() min: number | undefined;
  @Input() max: number | undefined;
  @Input() step = 1;
  @Input() symbol: string | undefined;
  @Input() prefix: string | undefined;
  @Input() decimalLimit: number | undefined;
  @Input() integerLimit: number | null = null;
  // tslint:disable-next-line:no-output-rename
  @Output('onChange') eventOnChange = new EventEmitter<any>();

  // tslint:disable-next-line:member-ordering
  public controlValue: string | undefined;
  public maskFomat: any = null;
  eventBaseChange = (_: any) => { };
  eventBaseTouched = () => { };

  ngOnInit() {
    if (this.symbol != '') {
      this.symbol = ' ';
    }
    else {
      this.symbol = '';
    }

    if (!this.prefix) {
      this.prefix = '';
    }

    if (!this.decimalLimit) {
      this.decimalLimit = 2;
    }

    this.maskFomat = createNumberMask({
      prefix: this.prefix,
      suffix: '',
      allowNegative: true,
      allowDecimal: true,
      decimalLimit: this.decimalLimit,
      integerLimit: this.integerLimit,
      thousandsSeparatorSymbol: this.symbol
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngAfterViewInit() {
    $(this.el.nativeElement).removeClass(this.class);
  }

  writeValue(obj: number | null) {
    this.controlValue = obj?.toString();
  }

  registerOnChange(fn: any) {
    this.eventBaseChange = fn;
  }

  registerOnTouched(fn: any) {
    this.eventBaseTouched = fn;
  }

  onChange() {
    const val = this.getValue();
    this.eventBaseChange(val);
    this.eventOnChange.emit(val);
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(c: FormControl) {
    const value = this.getValue();
    if (c.valid && value !== null) {
      if (isNaN(value)) {
        return { error: `Giá trị không đúng định dạng` }
      }
      if (this.max !== undefined) {
        if (this.max < value) {
          return { error: `Giá trị không được lớn hơn ${this.max}` }
        }
      }
      if (this.min !== undefined) {
        if (this.min > value) {
          return { error: `Giá trị không được nhỏ hơn ${this.min}` }
        }
      }
    }
    return null;
  }

  pushValue() {
    const val = this.getValue();
    if (val === null) {
      if (this.min !== undefined) {
        this.controlValue = this.min.toString();
        this.onChange();
      } else {
        this.controlValue = '0';
        this.onChange();
      }
      return;
    }

    if (this.max !== undefined && val + this.step > this.max) {
      this.controlValue = this.max?.toString();
      this.onChange();
      return;
    }
    this.controlValue = (val + this.step).toFixedAndClear(this.decimalLimit!);
    this.onChange();
  }

  minusValue() {
    const val = this.getValue();
    if (val === null) {
      if (this.min !== undefined) {
        this.controlValue = this.min.toString();
        this.onChange();
      } else {
        this.controlValue = '0';
        this.onChange();
      }
      return;
    };
    if (this.min !== undefined && val <= this.min) { return; }
    this.controlValue = (val - this.step).toFixedAndClear(this.decimalLimit!);
    this.onChange();
  }

  private getValue(): number | null {
    let val: any = this.controlValue;
    if (val === null || val === undefined) {
      return null;
    }
    val = val.toString().replace(new RegExp(this.symbol!, 'g'), '');
    if (this.prefix !== '') {
      val = val.replace(new RegExp(this.prefix!, 'g'), '');
    }
    return +(+val).toFixed(this.decimalLimit!);
  }
}
