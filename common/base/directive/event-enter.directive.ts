import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[eventEnter]'
})
export class EventEnterDirective {

  @Output() onEnter = new EventEmitter<boolean>();

  @HostListener("document:keydown", ["$event"])
  public onListenerTriggered(event: any): void {
      this.onEnter.emit(true);
  }

}
