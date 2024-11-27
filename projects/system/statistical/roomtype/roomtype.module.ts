import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomTypeComponent } from './roomtype.component';
import { FormModule } from 'common/base/module/form.module';
import { RoomTypeRoutes } from './roomtype.routing';
import { RoomTypeDetailComponent } from './roomtype-detail/roomtype-detail.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormModule,
    NgChartsModule,
    NgChartsModule,
    RoomTypeRoutes,
  ],
  declarations: [RoomTypeComponent, RoomTypeDetailComponent]
})
export class RoomTypeModule { }
