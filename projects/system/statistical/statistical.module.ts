import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticalComponent } from './statistical.component';
import { FormModule } from 'common/base/module/form.module';
import { StatisticalDetailComponent } from './statistical-detail/statistical-detail.component';
import { StatisticalRoutes } from './statistical.routing';

@NgModule({
  imports: [
    CommonModule,
    FormModule,
    StatisticalRoutes
  ],
  declarations: [
    StatisticalComponent,
    StatisticalDetailComponent
  ],
  exports: [
    StatisticalComponent 
  ]
})
export class StatisticalModule { }
//nhu the la duoc 
