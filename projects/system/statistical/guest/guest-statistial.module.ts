import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'common/base/module/form.module';
import { NgChartsModule } from 'ng2-charts';
import { GuestRoutes } from 'projects/system/guest/guest.routing';
import { GuestStatisticalComponent } from './guest-statistical.component';
import { GuestStatisticalDetailComponent } from './guest-detail/guest-statistical-detail.component';


@NgModule({
  imports: [
    CommonModule,
    FormModule,
    NgChartsModule,
    NgChartsModule,
    GuestRoutes ,
  ],
  declarations: [GuestStatisticalComponent,  GuestStatisticalDetailComponent]
})
export class GuestStatisticalModule { }
