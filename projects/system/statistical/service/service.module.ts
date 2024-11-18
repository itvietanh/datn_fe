import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { FormModule } from 'common/base/module/form.module';
import { NgChartsModule } from 'ng2-charts';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { ServiceComponent } from './service.component';
import { ServiceRoutes } from './service.routing';


@NgModule({
  imports: [
    CommonModule,
    FormModule,
    CanvasJSAngularChartsModule,
    RouterOutlet,
    NgChartsModule,
    ServiceRoutes
  ],
  declarations: [
    ServiceComponent,
    ServiceDetailComponent
  ],
  exports: [
    ServiceComponent
  ]
})
export class ServiceModule { }
