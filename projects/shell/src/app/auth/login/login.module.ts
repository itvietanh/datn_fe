import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'common/base/module/form.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { LoginRoutes } from './login.routing';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    FormModule,
    CommonModule,
    ReactiveFormsModule,
    LoginRoutes
  ],
  
})
export class LoginModule { }
