import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'common/base/module/form.module';
import { RoomTypeRoutes } from './roomtype.routing';
import { RoomTypeComponent } from './roomtype.component';
import { RoomTypeDetailsComponent } from './roomtype-detail/roomtype-details.component';

@NgModule({
  imports: [CommonModule, FormModule, RoomTypeRoutes],
  declarations: [RoomTypeComponent, RoomTypeDetailsComponent],
})
export class RoomTypeModule {}
