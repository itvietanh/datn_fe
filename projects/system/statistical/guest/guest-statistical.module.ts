import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'common/base/module/form.module';
import { NgChartsModule } from 'ng2-charts';
import { GuestStatisticalComponent } from './guest-statistical.component';
import { GuestStatisticalDetailComponent } from './guest-detail/guest-statistical-detail.component';
import { GuestStatisticalRoutes } from './guest-statistical.routing';


@NgModule({
  imports: [
    CommonModule,
    FormModule,
    NgChartsModule,
    NgChartsModule,
    GuestStatisticalRoutes,
  ],
  declarations: [GuestStatisticalComponent, GuestStatisticalDetailComponent]
})
export class GuestStatisticalModule { }
