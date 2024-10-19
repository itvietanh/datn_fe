import { Routes, RouterModule } from '@angular/router';
import { GuestAccountsComponent } from './guestaccounts.component';


const routes: Routes = [{ path: '', component: GuestAccountsComponent }];

export const GuestAccountRoutes = RouterModule.forChild(routes);
