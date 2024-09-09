import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter, ElementRef, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

declare let $: any;
@Component({
  selector: 'input-text-search',
  templateUrl: './input-text-search.component.html',
  styleUrls: ['./input-text-search.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextSearchComponent),
      multi: true,
    }]
})
export class InputTextSearchComponent implements OnInit, ControlValueAccessor, OnChanges {

  public controlValue: string | null = null;

  @Input() select = false;
  @Output() selectChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() class: any = '';
  @Input() placeholder: any = '';
  @Input() disabled = false;
  @Input() hidden = false;
  @Input() readonly = false;
  @Input() noBorder = false;
  // tslint:disable-next-line: no-output-rename
  @Output('onChange') eventOnChange = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output('onBlur') eventOnBlur = new EventEmitter<void>();
  // tslint:disable-next-line: no-output-rename
  @Output('onUnBlur') eventOnUnBlur = new EventEmitter<void>();
  // tslint:disable-next-line: no-output-rename
  @Output('onClear') eventOnClear = new EventEmitter<void>();
  @Output('onKeyUp') eventOnKeyUp = new EventEmitter<any>();
  @Output('onKeyEnter') eventOnKeyEnter = new EventEmitter<void>();
  @Output('onSearch') eventOnSearch = new EventEmitter<any>();
  eventBaseChange = (_: any) => { };
  eventBaseTouched = () => { };

  idElement: string = this.generateQuickGuid();

  constructor(
    private el: ElementRef
  ) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['select']?.currentValue === true) {
      if (changes['select']?.firstChange) {
        setTimeout(() => {
          $('#' + this.idElement).focus();
          $('#' + this.idElement).select();
          this.selectChange.emit(false);
        }, 1000);
      } else {
        setTimeout(() => {
          $('#' + this.idElement).focus();
          $('#' + this.idElement).select();
          this.selectChange.emit(false);
        }, 50);
      }
    }
  }

  writeValue(obj: any): void {
    this.controlValue = obj;
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

  onKeyUp(value: any): void {
    this.eventOnKeyUp.emit(value);
    if (value.keyCode === 13) {
      this.eventOnKeyEnter.emit();
    }
  }

  onChange(): void {
    this.eventBaseChange(this.controlValue);
    this.eventOnChange.emit(this.controlValue);
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onClear(): void {
    this.controlValue = '';
    this.eventBaseChange(this.controlValue);
    this.eventOnChange.emit(this.controlValue);
    this.eventOnClear.emit();
  }

  public randomCustom(): number {
    let random = () => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
    return random();
  }

  generateQuickGuid() {
    return (
      this.randomCustom().toString(36).substring(2, 15) +
      this.randomCustom().toString(36).substring(2, 15)
    );
  }

  search() {
    this.eventOnSearch.emit(this.controlValue);
  }
}
