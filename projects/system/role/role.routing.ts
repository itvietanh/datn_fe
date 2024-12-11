import { Routes, RouterModule } from '@angular/router';
import { RoleComponent } from './role.component';

const routes: Routes = [{ path: '', component: RoleComponent }];

export const RoleRoutes = RouterModule.forChild(routes);
