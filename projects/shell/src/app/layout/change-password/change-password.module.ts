import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './change-password.component';
import { ChangePasswordRoutes } from './change-password.routing';
import { FormModule } from 'common/base/module/form.module';

@NgModule({
  imports: [
    CommonModule,
    FormModule,
    ChangePasswordRoutes
  ],
  declarations: [ChangePasswordComponent]
})
export class ChangePasswordModule { }
