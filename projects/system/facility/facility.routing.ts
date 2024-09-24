import { Routes, RouterModule } from '@angular/router';
import { FacilityComponent } from './facility.component';

const routes: Routes = [{ path: '', component: FacilityComponent }];

export const FacilityRoutes = RouterModule.forChild(routes);
