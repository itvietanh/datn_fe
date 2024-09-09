import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appCellTemplate]',
})
export class CellTemplateDirective {
  @Input('appCellTemplate') key: string | undefined;

  constructor(public templateRef: TemplateRef<any>) {}
}
