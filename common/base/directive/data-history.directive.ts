import { DatePipe } from '@angular/common';
import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

declare let $: any;
@Directive({
  selector: '[dataHistory]'
})
export class DataHistoryDirective {

  @Input() dataNew: any | undefined;
  @Input() dataOld: any | undefined;
  @Input() disabled: boolean | undefined;

  private title: string = '';
  private listenClick: any;
  private danhmucService: any;

  constructor(private renderer: Renderer2,
    private hostElement: ElementRef,
    private elementRef: ElementRef,
    private datePipe: DatePipe
  ) { }

  ngOnChanges() {
    setTimeout(() => {
      this.initData();
    }, 300);
  }

  async initData() {
    if (!this.dataNew || !this.dataOld || !this.elementRef?.nativeElement) return;
    if (this.disabled) {
      this.renderer.removeClass(this.hostElement.nativeElement, 'data-edit');
      $(this.elementRef.nativeElement).find('.i-his').remove();
      return;
    }
    let keyName = $(this.elementRef.nativeElement).attr('dataHistory');
    if (!keyName) {
      keyName = $(this.elementRef.nativeElement).find('[formcontrolname]')[0].getAttribute('formcontrolname');
    }
    let type = $(this.elementRef.nativeElement).find('[formcontrolname]')[0].localName;
    let dataCombobox: any[];
    let action = '';
    if (this.dataNew[keyName] !== this.dataOld[keyName]) {
      let oldText: any = '';
      let newText: any = '';
      switch (type) {
        case 'input-date':
          if (this.dataOld[keyName]) {
            oldText = this.dateFormat(this.dataOld[keyName], 'dd/MM/yyyy');
          }
          if (this.dataNew[keyName]) {
            newText = this.dateFormat(this.dataNew[keyName], 'dd/MM/yyyy');
          }
          break;
        case 'input-date-dynamic':
          if (this.dataOld[keyName]) {
            oldText = this.dateFormat(this.dataOld[keyName], 'dd/MM/yyyy');
          }
          if (this.dataNew[keyName]) {
            newText = this.dateFormat(this.dataNew[keyName], 'dd/MM/yyyy');
          }
          break;
        case 'input-select-api':
          action = $(this.elementRef.nativeElement).find('[formcontrolname]').find('nz-select')[0].getAttribute('actionname');
          if (this.dataOld[keyName]) {
            dataCombobox = await [{ value: this.dataOld[keyName] }].getMapingCombobox('value', 'text', this.danhmucService, null, action);
            oldText = dataCombobox[0].text;
          }
          if (this.dataNew[keyName]) {
            dataCombobox = await [{ value: this.dataNew[keyName] }].getMapingCombobox('value', 'text', this.danhmucService, null, action);
            newText = dataCombobox[0].text;
          }
          break;
        case 'input-select-tree-api':
          action = $(this.elementRef.nativeElement).find('[formcontrolname]').find('nz-input-group')[0].getAttribute('actionname');
          if (this.dataOld[keyName]) {
            dataCombobox = await [{ value: this.dataOld[keyName] }].getMapingCombobox('value', 'text', this.danhmucService, null, action);
            oldText = dataCombobox[0].text;
          }
          if (this.dataNew[keyName]) {
            dataCombobox = await [{ value: this.dataNew[keyName] }].getMapingCombobox('value', 'text', this.danhmucService, null, action);
            newText = dataCombobox[0].text;
          }
          break;
        case 'input-check-box':
          if (this.dataOld[keyName]) {
            oldText = this.dataOld[keyName] == 1 ? 'Chọn' : 'Không chọn';
          }
          if (this.dataNew[keyName]) {
            newText = this.dataNew[keyName] == 1 ? 'Chọn' : 'Không chọn';
          }
          break;
        case 'input-select-multiple-api':
          action = $(this.elementRef.nativeElement).find('[formcontrolname]').find('nz-select')[0].getAttribute('actionname');
          if (this.dataOld[keyName] && this.dataOld[keyName].length > 0) {
            dataCombobox = await this.dataOld[keyName].map((x: any) => { return { value: x } }).getMapingCombobox('value', 'text', this.danhmucService, null, action);
            let path = '';
            for (const item of dataCombobox) {
              oldText += `${path}${item.text}`;
              path = ', ';
            }
          };
          if (this.dataNew[keyName] && this.dataNew[keyName].length > 0) {
            dataCombobox = await this.dataNew[keyName].map((x: any) => { return { value: x } }).getMapingCombobox('value', 'text', this.danhmucService, null, action);
            let path = '';
            for (const item of dataCombobox) {
              newText += `${path}${item.text}`;
              path = ', ';
            }
          }
          break;
        default:
          oldText = this.dataOld[keyName];
          newText = this.dataNew[keyName];
          break;
      }
      if (!oldText) {
        oldText = '[Trống]';
      }
      if (!newText) {
        newText = '[Trống]';
      }
      if (oldText == newText) return;

      this.title = `${oldText} -> ${newText}`;
      this.renderer.addClass(this.hostElement.nativeElement, 'data-edit');
      $(this.elementRef.nativeElement).append('<div class="i-his"><i class="icon-history"></i></div>')
    }
  }

  @HostListener('mouseenter') onMouseEnter(event: any): void {
    if (this.disabled) return;
    $(this.elementRef.nativeElement).append('<div class="i-mess">' + this.title + '</div>');
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    if (this.disabled) return;
    $(this.elementRef.nativeElement).find('.i-mess').remove();
  }

  dateFormat(value: any, format?: string): any {
    let date = null;
    if (format == null) {
      format = 'dd/MM/yyyy';
    }
    if (typeof value === 'string') {
      date = new Date(value);
    } if (typeof value === 'number') {
      if (value.toString().length === 4) {
        return value.toString();
      } else if (value.toString().length === 6) {
        return `${value.toString().substring(4, 6)}/${value.toString().substring(0, 4)}`
      }
      date = new Date(parseInt((value + '').substring(0, 4)), parseInt((value + '').substring(4, 6)) - 1, parseInt((value + '').substring(6, 8)))
    }
    else {
      date = value;
    }
    return this.datePipe.transform(date, format);
  }
}
