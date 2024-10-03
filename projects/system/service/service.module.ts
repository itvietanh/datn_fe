import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceComponent } from './service.component';
import { FormModule } from 'common/base/module/form.module';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { ServiceRoutes } from './service.routing';

@NgModule({
  imports: [
    FormModule,
    CommonModule,
    ServiceRoutes
  ],
  declarations: [ServiceComponent, ServiceDetailComponent]
})
export class ServiceModule { }
