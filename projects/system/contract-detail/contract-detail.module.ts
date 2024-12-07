import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormModule } from 'common/base/module/form.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CustomerScannerModule } from '../customer-scanner/customer-scanner.module';
import { ContractDetailInfoComponent } from './contract-detail-info/contract-detail-info.component';
import { ContractDetailTab1Component } from './contract-detail-tab1/contract-detail-tab1.component';
import { ContractDetailTab2Component } from './contract-detail-tab2/contract-detail-tab2.component';
import { ContractDetailComponent } from './contract-detail.component';
import { ResidentDataComponent } from './resident-data/resident-data.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@NgModule({
  imports: [
    CommonModule,
    FormModule,
    NzDividerModule,
    CustomerScannerModule,
    NzTabsModule
  ],
  declarations: [
    ContractDetailComponent,
    ContractDetailTab1Component,
    ContractDetailTab2Component,
    ResidentDataComponent,
    ContractDetailInfoComponent,
  ],
})
export class ContractDetailModule { }
