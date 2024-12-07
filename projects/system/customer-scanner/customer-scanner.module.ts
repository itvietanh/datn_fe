import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
import { CustomerScannerIdBoxComponent } from './customer-scanner-id-box/customer-scanner-id-box.component';
import { CustomerScannerVneidComponent } from './customer-scanner-vneid/customer-scanner-vneid.component';
import { CustomerScannerComponent } from './customer-scanner.component';
import { FormModule } from 'common/base/module/form.module';
import { NgModule } from '@angular/core';
import { CustomerScannerQrComponent } from './customer-scanner-qr/customer-scanner-qr.component';
import { CustomerDataComponent } from './customer-data/customer-data.component';
import { CustomerScannerButtonComponent } from './customer-scanner-button/customer-scanner-button.component';

@NgModule({
  declarations: [
    CustomerScannerComponent,
    CustomerScannerIdBoxComponent,
    CustomerScannerVneidComponent,
    CustomerScannerQrComponent,
    CustomerDataComponent,
    CustomerScannerButtonComponent,
  ],
  exports: [
    CustomerScannerComponent,
    CustomerDataComponent,
    CustomerScannerButtonComponent,
  ],
  imports: [CommonModule, ZXingScannerModule, NzQRCodeModule, FormModule],
})
export class CustomerScannerModule {}
