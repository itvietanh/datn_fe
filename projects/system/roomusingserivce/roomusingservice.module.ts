import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'common/base/module/form.module';
import { RoomUsingServiceComponent } from './roomusingservice.component';
import { RoomUsingServiceDetailsComponent } from './roomusingservice-detail/roomusingservice-details.component';
import { RoomUsingServiceRoutes } from './roomusingservice.routing';

@NgModule({
  imports:
    [CommonModule,
      FormModule,
      RoomUsingServiceRoutes
    ],
  declarations: [RoomUsingServiceComponent, RoomUsingServiceDetailsComponent],
})
export class RoomUsingServiceModule { }
