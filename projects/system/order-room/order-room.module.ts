import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormModule } from 'common/base/module/form.module';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
// import { CustomerScannerModule } from '../customer-scanner/customer-scanner.module';
import { BookingListComponent } from './booking-list/booking-list.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { CreateBookingComponent } from './create-booking/create-booking.component';
import { EditBookingComponent } from './edit-booking/edit-booking.component';
import { ImportBookingComponent } from './create-booking/import-booking/import-booking.component';
import { CommonModule } from '@angular/common';
import { ContractDetailModule } from '../contract-detail/contract-detail.module';
import { CustomerScannerModule } from '../customer-scanner/customer-scanner.module';

@NgModule({
  imports: [
    FormModule,
    CommonModule,
    NzSwitchModule,
    NzRadioModule,
    NzCardModule,
    NzInputNumberModule,
    NzInputModule,
    NzBadgeModule,
    NzUploadModule,
    ContractDetailModule,
    RouterModule.forChild([
      { path: '', component: BookingListComponent },
      { path: 'dat-phong', component: CreateBookingComponent },
    ]),
    CustomerScannerModule
  ],
  declarations: [CreateBookingComponent, BookingListComponent, EditBookingComponent, ImportBookingComponent],
})
export class OrderRoomModule {}
