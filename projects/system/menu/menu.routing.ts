import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu.component';

const routes: Routes = [
  { path:'', component: MenuComponent },
];

export const MenuRoutes = RouterModule.forChild(routes);
