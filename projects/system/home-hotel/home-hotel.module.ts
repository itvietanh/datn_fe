import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'common/base/module/form.module';
import { HomeHotelRoutes } from './home-hotel.routing';
import { HomeHotelDetailsComponent } from './tab-home-hotel/home-hotel-details.component';
import { HomeHotelComponent } from './home-hotel.component';
import { QrCodeDetailsComponent } from './tab-home-hotel/tab-qrcode/qrcode-details.component';
import { CustomerDataComponent } from './customer-data/customer-data.component';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';

@NgModule({
  imports:
    [CommonModule,
      FormModule,
      NzSegmentedModule,
      HomeHotelRoutes
    ],
  declarations: [HomeHotelComponent, HomeHotelDetailsComponent, QrCodeDetailsComponent, CustomerDataComponent],
})
export class HomeHotelModule { }
