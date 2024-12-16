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
import { ServiceDetailModule } from './tab-contract/tabs/tab-contract-step2/service-detail/service-detail.module';
import { CustomerScannerModule } from '../customer-scanner/customer-scanner.module';

@NgModule({
  imports:
    [CommonModule,
      FormModule,
      NzSegmentedModule,
      TabContractModule,
      ServiceDetailModule,
      CustomerScannerModule,
      HomeHotelRoutes,
    ],
    declarations: [HomeHotelComponent, HomeHotelDetailsComponent, QrCodeDetailsComponent, RoomChangeComponent],
})
export class HomeHotelModule { }
