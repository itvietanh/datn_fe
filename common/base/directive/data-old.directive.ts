import { DatePipe } from '@angular/common';
import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[dataOld]'
})
export class DataOldDirective {

  @Input() data: any | undefined;
  public listenClick: any;

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

  initData() {
    if (!this.data) return;

    this.renderer.addClass(this.hostElement.nativeElement, 'td-his-edit');
    //create the DOM element
    let divElement = this.renderer.createElement('div');
    this.renderer.addClass(divElement, 'hist-content');

    const text = this.renderer.createText(`Dữ liệu cũ: ${this.data}`);
    this.renderer.appendChild(divElement, text);

    this.renderer.appendChild(this.hostElement.nativeElement, divElement);
  }
}
