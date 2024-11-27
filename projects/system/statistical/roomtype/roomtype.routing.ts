import { Routes, RouterModule } from '@angular/router';
import { RoomTypeComponent } from './roomtype.component';

const routes: Routes = [{ path: '', component: RoomTypeComponent }];

export const RoomTypeRoutes = RouterModule.forChild(routes);
