// tslint:disable-next-line:max-line-length
import { Component, OnInit, ViewEncapsulation, forwardRef, AfterViewInit, OnChanges, Input, Output, EventEmitter, ElementRef, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

declare let $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'input-radio',
  templateUrl: './input-radio.component.html',
  styleUrls: ['./input-radio.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputRadioComponent),
      multi: true,
    }]
})
export class InputRadioComponent implements OnInit, AfterViewInit, ControlValueAccessor, OnChanges {

  public controlValue: string | null = null;

  @Input() className: any = '';
  @Input() disabled = false;
  @Input() items: any[] = [];
  // tslint:disable-next-line:no-output-rename
  @Output('onChange') eventOnChange = new EventEmitter<any>();
  eventBaseChange = (_: any) => { };
  eventBaseTouched = () => { };

  constructor(
    private el: ElementRef
  ) { }

  ngOnInit() {
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
    //if (!this.isFocus) return;
    this.eventBaseChange(this.controlValue);
    this.eventOnChange.emit(this.controlValue);
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
