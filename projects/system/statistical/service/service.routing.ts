import { Routes, RouterModule } from '@angular/router';
import { ServiceComponent } from 'projects/system/statistical/service/service.component';

const routes: Routes = [{ path: '', component: ServiceComponent }];

export const ServiceRoutes = RouterModule.forChild(routes);