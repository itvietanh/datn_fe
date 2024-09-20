import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'common/base/module/form.module';
import { HomeHotelRoutes } from './home-hotel.routing';
import { HomeHotelDetailsComponent } from './tab-home-hotel/home-hotel-details.component';
import { HomeHotelComponent } from './home-hotel.component';
import { QrCodeDetailsComponent } from './tab-home-hotel/tab-qrcode/qrcode-details.component';

@NgModule({
  imports:
    [CommonModule,
      FormModule,
      HomeHotelRoutes
    ],
  declarations: [HomeHotelComponent, HomeHotelDetailsComponent, QrCodeDetailsComponent],
})
export class HomeHotelModule { }
