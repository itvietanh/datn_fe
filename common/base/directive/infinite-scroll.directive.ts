import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

declare let $: any;
@Directive({
  selector: '[infiniteScroll]'
})
export class InfiniteScrollDirective {


  @Input() scrollThreshold = 50; // px
  @Input('infiniteScroll') loadMore: any;
  public scrollTop$ = new BehaviorSubject<number | null>(null);

  constructor(private element: ElementRef) {
    this.scrollTop$.asObservable().pipe(debounceTime(500)).subscribe(x => {
      if (!x) return;
      this.loadMore();
    })
  }

  @HostListener('scroll')
  public onScroll() {
    const scrolled = this.element.nativeElement.scrollTop;
    const height = this.element.nativeElement.offsetHeight;
    if(!this.element.nativeElement.children || this.element.nativeElement.children.length === 0) return;
    const heightContent = this.element.nativeElement.children[0].offsetHeight;

    // if we have reached the threshold and we scroll down
    if ((heightContent - height) - scrolled < this.scrollThreshold) {
      this.scrollTop$.next(scrolled);
    }

  }

}
