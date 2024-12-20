import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'common/base/module/form.module';
import { GuestRoutes } from './guest.routing';
import { GuestComponent } from './guest.component';
import { GuestDetailsComponent } from './guest-detail/guest-details.component';
// import { GuestService } from 'common/share/src/service/application/hotel/guest.service';

@NgModule({
  imports: [CommonModule, FormModule, GuestRoutes],
  declarations: [GuestComponent, GuestDetailsComponent],
})
export class GuestModule {}
