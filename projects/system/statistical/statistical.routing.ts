import { Routes, RouterModule } from '@angular/router';
import { StatisticalComponent } from './statistical.component';

const routes: Routes = [{ path: '', component: StatisticalComponent }];

export const ServiceRoutes = RouterModule.forChild(routes);
