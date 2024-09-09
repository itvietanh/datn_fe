import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'common/base/service/auth.guard';
import { Error404Component } from './error/error-404/error-404.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((x) => x.AuthModule),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./error/error.module').then((x) => x.ErrorModule),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./layout/layout.module').then((x) => x.LayoutModule),
  },
  { path: '**', component: Error404Component },
];

export const AppRoutes = RouterModule.forRoot(routes);
