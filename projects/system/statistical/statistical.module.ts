import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { StatisticalComponent } from './statistical.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { FormModule } from 'common/base/module/form.module';
import { StatisticalDetailComponent } from './statistical-detail/statistical-detail.component';
import { StatisticalRoutes } from './statistical.routing';

@NgModule({
  imports: [
    CommonModule,
    FormModule,
    CanvasJSAngularChartsModule,
    RouterOutlet,
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
