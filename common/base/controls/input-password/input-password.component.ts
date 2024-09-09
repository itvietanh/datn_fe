// tslint:disable-next-line:max-line-length
import { Component, OnInit, ViewEncapsulation, forwardRef, OnChanges, Input, Output, EventEmitter, ElementRef, AfterViewInit, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

declare var $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputPasswordComponent),
      multi: true,
    }]
})
export class InputPasswordComponent implements OnInit, AfterViewInit, ControlValueAccessor, OnChanges {

  public controlValue: string | null = null;

  @Input() placeholder: any = '';
  @Input() disabled = false;
  @Input() hidden = false;
  @Input() autofocus = false;
  @Input() autocomplete = true;
  // tslint:disable-next-line:no-output-rename
  @Output('onChange') eventOnChange = new EventEmitter<any>();
  @Output('onClear') eventOnClear = new EventEmitter<void>();
  @Output('onKeyUp') eventOnKeyUp = new EventEmitter<any>();
  @Output('onKeyEnter') eventOnKeyEnter = new EventEmitter<void>();
  eventBaseChange = (_: any) => { };
  eventBaseTouched = () => { };

  constructor(
    private el: ElementRef
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngAfterViewInit(): void {
    if(this.autocomplete === false){
      setTimeout(() => {
        $(this.el.nativeElement).find('input').removeAttr('readonly');
      }, 300);
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

  onChange(): void {
    this.eventBaseChange(this.controlValue);
    this.eventOnChange.emit(this.controlValue);
  }

  onKeyUp(value: any): void {
    this.eventOnKeyUp.emit(value);
    if (value.keyCode === 13) {
      this.eventOnKeyEnter.emit();
    }
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
}
