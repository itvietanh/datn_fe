import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'common/base/module/form.module';
import { HomeHotelRoutes } from './home-hotel.routing';
import { HomeHotelDetailsComponent } from './tab-home-hotel/home-hotel-details.component';
import { HomeHotelComponent } from './home-hotel.component';
import { QrCodeDetailsComponent } from './tab-home-hotel/tab-qrcode/qrcode-details.component';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { TabContractModule } from './tab-contract/tab-contract.module';
import { RoomChangeComponent } from './room-change/room-change.component';
import { GuestDetailComponent } from './tab-contract/tabs/tab-contract-step2/guest-detail/guest-detail.component';

@NgModule({
  imports:
    [CommonModule,
      FormModule,
      NzSegmentedModule,
      HomeHotelRoutes,
      TabContractModule
    ],
  declarations: [HomeHotelComponent, HomeHotelDetailsComponent, QrCodeDetailsComponent, RoomChangeComponent, GuestDetailComponent],
})
export class HomeHotelModule { }
