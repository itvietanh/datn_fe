import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { environment } from 'common/environments/environment';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./home/home.module').then((x) => x.HomeModule),
      },
      {
        path: 'he-thong',
        loadChildren: () =>
          import('projects/system/system.module').then((x) => x.SystemModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((x) => x.ProfileModule),
      },
      {
        path: 'change-password',
        loadChildren: () =>
          import('./change-password/change-password.module').then(
            (x) => x.ChangePasswordModule
          ),
      },
    ],
  },
];

export const LayoutRoutes = RouterModule.forChild(routes);
