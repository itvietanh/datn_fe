import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'common/base/module/form.module';
import { RoomTypeComponent } from './roomtype.component';
import { RoomTypeRoutes } from './roomtype.routing';

@NgModule({
  imports: [CommonModule, FormModule, RoomTypeRoutes],
  declarations: [RoomTypeComponent],
})
export class RoomTypeModule {}
