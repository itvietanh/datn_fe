import { Routes, RouterModule } from '@angular/router';
import { EmployeeComponent } from './employee.component';

const routes: Routes = [{ path: '', component: EmployeeComponent }];

export const EmployeeRoutes = RouterModule.forChild(routes);
