import { AfterContentInit, Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[viewControl]'
})
export class ViewControlDirective implements OnInit, OnChanges, AfterContentInit {

  @Input() viewControl: any

  constructor(private elementRef: ElementRef, private renderer2: Renderer2) {

  }


  ngAfterContentInit(): void {
  }


  ngOnChanges(changes: SimpleChanges): void {

    this.setViewControl(this.viewControl);
  }

  ngOnInit(): void {
    this.setViewControl(this.viewControl);
  }


  private setViewControl(item: any) {
    const html = this.elementRef.nativeElement;
    if (item) {
      this.renderer2.addClass(html, 'view');
    } else {
      this.renderer2.removeClass(html, 'view');
    }
  }
}
