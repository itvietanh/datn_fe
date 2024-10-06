import { Routes, RouterModule } from '@angular/router';
import { GuestComponent } from './guest.component';


const routes: Routes = [{ path: '', component: GuestComponent }];

export const GuestRoutes = RouterModule.forChild(routes);
