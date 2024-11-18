import { Routes, RouterModule } from '@angular/router';
import { GuestStatisticalComponent } from './guest-statistical.component';

const routes: Routes = [{ path: '', component: GuestStatisticalComponent }];

export const  GuestRoutes = RouterModule.forChild(routes);
