import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { LayoutRoutes } from './layout.routing';
import { DirectiveModule } from 'common/base/directive/directive.module';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { FormModule } from 'common/base/module/form.module';

@NgModule({
  imports: [
    CommonModule,
    // IconsProviderModule,
    // NzSpinModule,
    // FormsModule,
    // ReactiveFormsModule,
    // PipeModule,
    // NzDropDownModule,
    NzBadgeModule,
    DirectiveModule,
    FormModule,
    LayoutRoutes
  ],
  declarations: [
    LayoutComponent,
    NavbarComponent,
    MenuComponent,
    FooterComponent
  ]
})
export class LayoutModule { }
