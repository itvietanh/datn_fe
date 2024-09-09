import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormModule } from 'common/base/module/form.module';
import { HomeComponent } from './home.component';
import { HomeRoutes } from './home.routing';

@NgModule({
  imports: [CommonModule, FormModule, HomeRoutes],
  declarations: [HomeComponent],
})
export class HomeModule {}
