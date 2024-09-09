import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { ProfileRoutes } from './profile.routing';
import { FormModule } from 'common/base/module/form.module';

@NgModule({
  imports: [
    CommonModule,
    FormModule,
    ProfileRoutes
  ],
  declarations: [ProfileComponent]
})
export class ProfileModule { }
