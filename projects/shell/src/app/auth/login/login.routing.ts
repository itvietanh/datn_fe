import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthGuard } from 'common/base/service/auth.guard';

const routes: Routes = [{ path: '', component: LoginComponent }];

export const LoginRoutes = RouterModule.forChild(routes);
