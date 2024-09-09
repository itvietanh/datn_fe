import { Routes, RouterModule } from '@angular/router';
import { HomeHotelComponent } from './home-hotel.component';

const routes: Routes = [{ path: '', component: HomeHotelComponent }];

export const HomeHotelRoutes = RouterModule.forChild(routes);
