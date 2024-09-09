import { Routes, RouterModule } from '@angular/router';
import { BuildingComponent } from './building.component';

const routes: Routes = [{ path: '', component: BuildingComponent }];

export const BuildingRoutes = RouterModule.forChild(routes);
