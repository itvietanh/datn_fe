import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { MenuRoutes } from './menu.routing';
import { MenuDetailsComponent } from './menu-details/menu-details.component';
import { FormModule } from 'common/base/module/form.module';

@NgModule({
  imports: [
    CommonModule,
    MenuRoutes,
    FormModule
  ],
  declarations: [MenuComponent,MenuDetailsComponent]
})
export class MenuModule { }
