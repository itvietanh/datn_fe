import { NgModule } from "@angular/core";
import { CellTemplateDirective } from "./cell-template.directive";
import { InfiniteScrollDirective } from './infinite-scroll.directive';
import { PermissionDirective } from './permission.directive';
import { ViewControlDirective } from './view-control.directive';

@NgModule({
  exports: [
    InfiniteScrollDirective,
    ViewControlDirective,
    PermissionDirective,
    CellTemplateDirective
  ],
  declarations: [
    InfiniteScrollDirective,
    PermissionDirective,
    ViewControlDirective,
    CellTemplateDirective
   ]
})
export class DirectiveModule { }
