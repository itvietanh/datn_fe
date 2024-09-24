import { Routes, RouterModule } from '@angular/router';
import { SystemComponent } from './system.component';

const routes: Routes = [
  {
    path: '',
    component: SystemComponent,
    children: [
      {
        path: 'trang-chu',
        loadChildren: () =>
          import('./home-hotel/home-hotel.module').then(
            (x) => x.HomeHotelModule
          ),
      },
      {
        path: 'co-so',
        loadChildren: () =>
          import('./facility/facility.module').then(
            (x) => x.FacilityModule
          ),
      },
      {
        path: 'danh-sach-tang',
        loadChildren: () =>
          import('./building/building.module').then(
            (x) => x.BuildingModule
          ),
      },
      {
        path: 'danh-sach-loai-phong',
        loadChildren: () =>
          import('./roomtype/roomtype.module').then(
            (x) => x.RoomTypeModule
          ),
      },
      {
        path: 'danh-sach-phong',
        loadChildren: () =>
          import('./room/room.module').then(
            (x) => x.RoomModule
          ),
      }
    ],
  },
];

export const SystemRoutes = RouterModule.forChild(routes);
