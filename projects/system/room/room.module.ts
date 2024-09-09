import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'common/base/module/form.module';
import { RoomRoutes } from './room.routing';
import { RoomDetailsComponent } from './tab-room/room-details.component';
import { RoomComponent } from './room.component';

@NgModule({
  imports: [CommonModule, FormModule, RoomRoutes],
  declarations: [RoomComponent, RoomDetailsComponent],
})
export class RoomModule {}
