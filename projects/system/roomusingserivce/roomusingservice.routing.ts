import { Routes, RouterModule } from '@angular/router';
import { RoomUsingServiceComponent } from './roomusingservice.component';

const routes: Routes = [{ path: '', component: RoomUsingServiceComponent }];

export const RoomUsingServiceRoutes = RouterModule.forChild(routes);
