import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'common/base/module/form.module';
// import { GuestAccountRoutes } from './guestaccounts.routing';
import { EmployeeComponent } from './employee.component';
import { EmployeeRoutes } from './employee.routing';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';

// import { GuestAccountsDetailComponent} from './guestaccounts-detail/guestaccounts-details.component';
// import { GuestAccountsComponent } from './guestaccounts.component';

@NgModule({
  imports: [CommonModule, FormModule, EmployeeRoutes],
  declarations: [EmployeeComponent, EmployeeDetailComponent],
})
export class EmployeeModule {}
