import { Routes, RouterModule } from '@angular/router';
import { GuestStatisticalComponent } from './guest-statistical.component';

const routes: Routes = [{ path: '', component: GuestStatisticalComponent }];

export const  GuestStatisticalRoutes = RouterModule.forChild(routes);
