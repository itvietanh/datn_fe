import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'common/base/module/form.module';
// import { GuestAccountRoutes } from './guestaccounts.routing';
import { ShiftComponent } from './shift.component';
import { ShiftDetailComponent } from './shift-details/shift-details.component';
import { ShiftRoutes } from './shift.routing';

// import { GuestAccountsDetailComponent} from './guestaccounts-detail/guestaccounts-details.component';
// import { GuestAccountsComponent } from './guestaccounts.component';

@NgModule({
  imports: [CommonModule, FormModule, ShiftRoutes],
  declarations: [ShiftComponent, ShiftDetailComponent]
})
export class ShiftModule {}
