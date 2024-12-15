import { Component, OnInit, ViewEncapsulation, forwardRef, OnChanges, Input, Output, EventEmitter, ElementRef, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'input-select',
  templateUrl: './input-select.component.html',
  styleUrls: ['./input-select.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSelectComponent),
      multi: true
    }
  ]
})
export class InputSelectComponent implements OnInit, ControlValueAccessor, OnChanges {
  constructor(private el: ElementRef) { }

  @Input() class: any = '';
  @Input() placeholder: any = '';
  @Input() disabled = false;
  @Input() hidden = false;
  @Input() readonly = false;
  @Input() allowClear = true;
  @Input() allowSearch = true;
  @Input() items: any[] = [];
  @Input() view: boolean | undefined;
  @Input() autoSelectFirst = false;

  // tslint:disable-next-line:no-output-rename
  @Output('onChange') eventOnChange = new EventEmitter<any>();
  // tslint:disable-next-line:no-output-rename
  @Output('onBlur') eventOnBlur = new EventEmitter<void>();
  // tslint:disable-next-line:no-output-rename
  @Output('onUnBlur') eventOnUnBlur = new EventEmitter<void>();

  public controlValue: any = null;
  eventBaseChange = (_: any) => { };
  eventBaseTouched = () => { };

  ngOnInit() {
    if (!this.placeholder) {
      this.placeholder = '-- Chọn --';
    }

    if (this.autoSelectFirst && this.items.length > 0 && this.controlValue === null) {
      this.selectFirstItem();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && this.autoSelectFirst && this.items.length > 0 && this.controlValue === null) {
      this.selectFirstItem();
    }
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

  onBlur() {
    this.eventBaseTouched();
    this.eventOnBlur.emit();
  }

  onUnBlur() {
    this.eventOnUnBlur.emit();
  }

  onChange() {
    const valueData = this.items.find((x) => x.value === this.controlValue);
    this.eventBaseChange(this.controlValue);
    this.eventOnChange.emit(valueData);
  }

  onClear() {
    this.controlValue = null;
    this.eventBaseChange(this.controlValue);
    this.eventOnChange.emit(this.controlValue);
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private selectFirstItem() {
    const firstItem = this.items[0];
    if (firstItem) {
      this.controlValue = firstItem.value;
      this.eventBaseChange(this.controlValue);
      this.eventOnChange.emit(firstItem);
    }
  }
}
