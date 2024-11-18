import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'common/base/module/form.module';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzListModule } from 'ng-zorro-antd/list';
import { AddContractServiceListComponent } from './add-contract-service-list/add-contract-service-list.component';
import { AddContractServiceFormComponent } from './add-contract-service-form/add-contract-service-form.component';
import { AddContractServiceForm1Component } from './add-contract-service-form-1/add-contract-service-form-1.component';
import { ServiceDetailComponent } from './service-detail.component';


@NgModule({
  imports: [CommonModule, FormModule, NzListModule, NzInputNumberModule],
  declarations: [
    ServiceDetailComponent,
    AddContractServiceListComponent,
    AddContractServiceFormComponent,
    AddContractServiceForm1Component
  ],
})
export class ServiceDetailModule { }
