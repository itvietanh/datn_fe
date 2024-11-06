import { Routes, RouterModule } from '@angular/router';
import { ServiceComponent } from 'projects/system/service/service.component';

const routes: Routes = [{ path: '', component: ServiceComponent }];

export const ServiceRoutes = RouterModule.forChild(routes);