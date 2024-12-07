import { Routes, RouterModule } from '@angular/router';
import { OrderHistoryComponent } from './order-history.component';

const routes: Routes = [{ path: '', component: OrderHistoryComponent }];

export const OrderHistoryRoutes = RouterModule.forChild(routes);
