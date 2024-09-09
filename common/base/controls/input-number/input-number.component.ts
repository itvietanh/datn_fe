import { Component, OnInit, ViewEncapsulation, forwardRef, AfterViewInit, OnChanges, Input, Output, EventEmitter, ElementRef, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
  selector: 'input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true
    }
  ]
})
export class InputNumberComponent implements OnInit, AfterViewInit, ControlValueAccessor, Validator, OnChanges {
  constructor(
    private el: ElementRef
  ) { }

  @Input() placeholder: any = '';
  @Input() disabled = false;
  @Input() hidden = false;
  @Input() readonly = false;
  @Input() min: number | undefined;
  @Input() max: number | undefined;
  @Input() step: number = 1;
  @Input() symbol: string | undefined;
  @Input() prefix: string | undefined;
  @Input() integerLimit: number | null = null;
  @Output('onChange') eventOnChange = new EventEmitter<any>();

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

    this.maskFomat = createNumberMask({
      prefix: this.prefix,
      allowNegative: true,
      allowDecimal: false,
      integerLimit: this.integerLimit,
      thousandsSeparatorSymbol: this.symbol,

    });
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngAfterViewInit() {

  }

  writeValue(obj: any) {
    this.controlValue = obj;
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
    const val: number | null = this.getValue();
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
      this.controlValue = this.max.toString();
      this.onChange();
      return;
    }
    this.controlValue = (val + this.step).toString();
    this.onChange();
  }

  minusValue() {
    const val: number | null = this.getValue();
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

    if (this.min !== undefined && val <= this.min) { return; }
    this.controlValue = (val - this.step).toString();
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
    return +val;
  }
}

