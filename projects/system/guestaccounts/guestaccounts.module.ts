import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'common/base/module/form.module';
import { GuestAccountRoutes } from './guestaccounts.routing';

import { GuestAccountsDetailComponent} from './guestaccounts-detail/guestaccounts-details.component';
import { GuestAccountsComponent } from './guestaccounts.component';

@NgModule({
  imports: [CommonModule, FormModule, GuestAccountRoutes],
  declarations: [GuestAccountsComponent, GuestAccountsDetailComponent],
})
export class GuestAccountModule {}
