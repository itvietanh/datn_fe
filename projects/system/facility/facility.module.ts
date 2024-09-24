import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'common/base/module/form.module';
import { FacilityRoutes } from './facility.routing';
import { FacilityDetailsComponent } from './facility-detail/facility-details.component';
import { FacilityComponent } from './facility.component';

@NgModule({
  imports:
    [CommonModule,
      FormModule,
      FacilityRoutes
    ],
  declarations: [FacilityComponent, FacilityDetailsComponent],
})
export class FacilityModule { }
