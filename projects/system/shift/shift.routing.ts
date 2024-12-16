import { Routes, RouterModule } from '@angular/router';
import { EmployeeService } from 'common/share/src/service/application/hotel/employee.service';
// import { EmployeeComponent } from './employee.component';
import { ShiftComponent } from './shift.component';
// import { GuestAccountsComponent } from './guestaccounts.component';


const routes: Routes = [{ path: '', component: ShiftComponent }];

export const ShiftRoutes = RouterModule.forChild(routes);
