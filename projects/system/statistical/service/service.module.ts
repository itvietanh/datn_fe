import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { FormModule } from 'common/base/module/form.module';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { ServiceComponent } from './service.component';
import { ServiceRoutes } from './service.routing';

@NgModule({
  imports: [
    CommonModule,
    FormModule,
    CanvasJSAngularChartsModule,
    RouterOutlet,
    ServiceRoutes
  ],
  declarations: [
    ServiceComponent,
    ServiceDetailComponent
  ],
  exports: [
<<<<<<< HEAD:projects/system/statistical/statistical.module.ts
    StatisticalComponent
=======
    ServiceComponent
>>>>>>> bbe5af90c7e1bf4a6f7bfb5560de5f21322e9bfc:projects/system/statistical/service/service.module.ts
  ]
})
export class ServiceModule { }
