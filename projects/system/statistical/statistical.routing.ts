import { Routes, RouterModule } from '@angular/router';
import { StatisticalComponent } from './statistical.component';

const routes: Routes = [{ path: '', component: StatisticalComponent }];

export const StatisticalRoutes = RouterModule.forChild(routes); // sua ca ten nay

// dung noi gi, me nguoi yeu toi goi ok