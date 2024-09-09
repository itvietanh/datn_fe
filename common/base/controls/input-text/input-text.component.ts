// tslint:disable-next-line:max-line-length
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true,
    },
    provideNgxMask(),
  ],
})
export class InputTextComponent
  implements OnInit, AfterViewInit, ControlValueAccessor, OnChanges
{
  public controlValue: string | null = null;

  @Input() focus = false;
  @Output() focusChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() placeholder: any = '';
  @Input() disabled = false;
  @Input() hidden = false;
  @Input() readonly = false;
  @Input() value: string | undefined;
  @Input() toUper: boolean | undefined;
  @Input() maxlength: string | number | null = null;
  @Input() autocomplete = false;
  @Input() mask?: string;
  @Input() trim = false;

  @Output('onChange') eventOnChange = new EventEmitter<any>();
  @Output('onChangeDelay') eventOnChangeDelay = new EventEmitter<any>();
  @Output('onClear') eventOnClear = new EventEmitter<void>();
  @Output('onKeyUp') eventOnKeyUp = new EventEmitter<any>();
  @Output('onKeyEnter') eventOnKeyEnter = new EventEmitter<void>();
  @Output('blur') eventBlur = new EventEmitter<void>();

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  eventBaseChange = (_: any) => {};
  eventBaseTouched = () => {};

  sub: any;
  textTransform = 'none';
  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    if (this.value) {
      this.controlValue = this.value;
    }
    if (this.toUper) {
      this.textTransform = 'uppercase';
    }
    if (this.trim && this.controlValue) {
      this.controlValue = this.controlValue.trim();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['focus']?.currentValue === true) {
      const ele = this.el.nativeElement.querySelector('input')!;
      if (changes['focus']?.firstChange) {
        setTimeout(() => {
          ele.focus();
          ele.select();
          this.focusChange.emit(false);
        }, 1000);
      } else {
        setTimeout(() => {
          ele.focus();
          ele.select();
          this.focusChange.emit(false);
        }, 50);
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.autocomplete === false) {
      setTimeout(() => {
        this.el.nativeElement
          .querySelector('input')
          ?.removeAttribute('readonly');
      }, 300);
    }
  }

  writeValue(obj: any): void {
    if (this.toUper) {
      this.controlValue = obj?.toUpperCase();
    } else {
      this.controlValue = obj;
    }

    if (this.trim && this.controlValue) {
      this.controlValue = this.controlValue.trim();
    }
  }

  setValue() {
    let value = this.input.nativeElement.value;
    if (this.toUper) {
      value = this.input.nativeElement.value?.toUpperCase();
    }
    if (this.trim && value) {
      value = value.trim();
    }
    this.eventBaseChange(value);
  }

  registerOnChange(fn: any): void {
    this.eventBaseChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.eventBaseTouched = fn;
  }

  onChange(): void {
    this.eventOnChange.emit(this.input.nativeElement.value);
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
    this.input.nativeElement.value = '';
    this.eventBaseChange(this.input.nativeElement.value);
    this.eventOnChange.emit(this.input.nativeElement.value);
    this.eventOnChangeDelay.emit(this.input.nativeElement.value);
    this.eventOnClear.emit();
  }

  onBlur(): void {
    this.eventBlur.emit();
  }
}
