import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { MenuDataDialogComponent } from './menu-data-dialog/menu-data-dialog.component';
import { MenuRoutes } from './menu.routing';
import { FormModule } from 'common/base/module/form.module';


@NgModule({
  imports: [
    CommonModule,
    FormModule,
    MenuRoutes
  ],
  declarations: [
    MenuComponent,
    MenuDataDialogComponent
  ]
})
export class MenuModule { }
