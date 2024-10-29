import { Routes, RouterModule } from '@angular/router';
import { SystemComponent } from './system.component';
import { AuthGuard } from 'common/base/service/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: SystemComponent,
    canActivate: [AuthGuard],
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
          import('./facility/facility.module').then((x) => x.FacilityModule),
      },
      {
        path: 'tai-khoan',
        loadChildren: () =>
          import('./employee/employee.module').then((x) => x.EmployeeModule),
      },
      {
        path: 'danh-sach-tang',
        loadChildren: () =>
          import('./building/building.module').then((x) => x.BuildingModule),
      },
      {
        path: 'danh-sach-loai-phong',
        loadChildren: () =>
          import('./roomtype/roomtype.module').then((x) => x.RoomTypeModule),
      },
      {
        path: 'danh-sach-phong',
        loadChildren: () =>
          import('./room/room.module').then((x) => x.RoomModule),
      },
      {
        path: 'dich-vu',
        loadChildren: () =>
          import('./service/service.module').then((x) => x.ServiceModule),
      },
      {
        path: 'giao-dich',
        loadChildren: () =>
          import('./transaction/transaction.module').then(
            (x) => x.TransactionModule
          ),
      },

      {
        path: 'dich-vu-khach-dat',
        loadChildren: () =>
          import('./roomusingserivce/roomusingservice.module').then(
            (x) => x.RoomUsingServiceModule
          ),
      },
      {
        path: 'nhan-vien',
        loadChildren: () =>
          import('./employee/employee.module').then((x) => x.EmployeeModule),
      },
      {
        path: 'khach-hang',
        loadChildren: () =>
          import('./guest/guest.module').then((x) => x.GuestModule),
      },
      {
        path: 'bao-cao',
        loadChildren: () =>
          import('./statistical/statistical.module').then(
            (x) => x.StatisticalModule
          ),
      },
      {
        path: 'menu',
        loadChildren: () =>
          import('./menu/menu.module').then(
            (x) => x.MenuModule
          ),
      },
      {
        path: 'dat-phong',
        loadChildren: () =>
          import('./order-room/order-room.module').then(
            (x) => x.OrderRoomModule
          ),
      },
    ],
  },
];

export const SystemRoutes = RouterModule.forChild(routes);
