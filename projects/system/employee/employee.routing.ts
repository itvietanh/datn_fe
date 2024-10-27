import { Routes, RouterModule } from '@angular/router';
import { EmployeeService } from 'common/share/src/service/application/hotel/employee.service';
import { EmployeeComponent } from './employee.component';
// import { GuestAccountsComponent } from './guestaccounts.component';


const routes: Routes = [{ path: '', component: EmployeeComponent }];

export const EmployeeRoutes = RouterModule.forChild(routes);
